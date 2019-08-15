/**
 * 注册api
 * */

const $G = global.$G = global.$G || {}
const fs = require('fs')
const path = require('path')
const $ = require('meeko')
const Mock = require('mockjs')
Mock.Random.extend($.Mock)
const mockFn = {
  noMock () {
    return function (ctx) {
      ctx.ok('controller未定义 & mock未定义')
    }
  },
  mockRouter (mockModels) {
    return function (ctx) {
      mockModels.isMock = 1
      ctx.ok(Mock.mock(mockModels))
    }
  }
}

const skyExt = require('../sky_extend')
const router = require('koa-router')()
const { routerDir, rootDir, apiDir, logger, serviceDir } = require('../../config')

const apiStat = $G.apiStat = {}// 接口各种状态

const frontApi = $G.frontApi = {} // 推送给前端的接口定义

skyExt.artStage('API Checking')

const controllerDir = path.join(rootDir, routerDir || 'router')

const apiRootDir = path.resolve(rootDir, apiDir)
const api = $G.api = $G.api || {}
const $S = $G.$S = $G.$S || {}

const routerLog = (result, name, apiPath, ms) => {
  if (logger) {
    let resultValue = JSON.stringify(result).replace(/: *"([^"]+)"/g, function (...item) {
      return item[1].length > 25 ? `:"${item[1].slice(0, 25)}${$.c.m('...')}"` : `:"${item[1]}"`
    })
    let resultKey = resultValue.replace(/"([a-zA-Z0-9_\$\.]+)" *:/g, function (...item) {
      return `"${$.c.dimy(item[1])}":`
    })
    resultKey = resultKey.slice(0, 1000)
    $.log('[router处理]=>', resultKey, `\n${$.c.dimc(name + apiPath)} => ${$.c.dimc(ms)} ms\n`)
  }
}

const warn = (...args) => {
  if (logger) {
    console.warn(...args)
  }
}

// 检查接口定义是否规范，不规范也不会出错，只会打印提示
const checkapiStandard = (apiPath, opt) => {
  const apiDesc = opt.name || opt.desc
  if (!apiDesc) {
    $.log($.c.y('?'), apiPath.fillStr(' ', 30), $.c.y('接口未写名称或描述'))
  } else if (apiPath.includes('_')) {
    $.log($.c.y('?'), apiPath.fillStr(' ', 30), $.c.y('接口命名不规范'))
  }
}

// 获取api需要执行的函数，判断是否使用mock也在这里面
const getApiFn = (apiPath, opt) => {
  let mockModel = 0
  if (!opt.controller) {
    if (opt.mock) {
      $.log($.c.g('✔'), apiPath.fillStr(' ', 30), $.c.r('controller未定义'), $.c.g('& mock已定义'))
      mockModel = 1
    } else {
      $.log($.c.r('✘'), apiPath.fillStr(' ', 30), $.c.r('controller未定义 & mock未定义'))
      mockModel = 2
    }
  }

  let func
  if (mockModel) {
    const fn = mockModel === 1 ? 'mockRouter' : 'noMock'
    func = mockFn[fn] && mockFn[fn](opt.mock)
  } else {
    const [file, fn] = opt.controller.split('.')
    try {
      const fileDir = path.resolve(rootDir, controllerDir, file)
      const contr = require(fileDir) || {}
      func = contr[fn]
      if (!func) {
        $.log($.c.r('✘'), apiPath.fillStr(' ', 30), $.c.r(`文件“${fileDir}”中不存在“${fn}”方法`))
      }
    } catch (e) {
      $.log($.c.r('✘'), apiPath.fillStr(' ', 30), $.c.r(`router不存在 ${file}`))
      $.log(e.stack)
    }
  }
  return func
}

const limitReqAction = (action, apiPath) => {
  return async function (ctx, next) {
    const start = Date.now()

    const { feqLimit, name, desc } = api[apiPath] || {}

    // 接口频率控制
    if (+feqLimit > 0) {
      const it = apiStat[apiPath] = apiStat[apiPath] || { n: 1, t: 0 }
      it.n++
      const diff = start - it.t
      if (1 / feqLimit * 1000 > diff) {
        ctx.body = {
          code: 402,
          data: diff,
          msg: '访问过快请稍后再试！'
        }

        routerLog(ctx.body, name || desc, apiPath, Date.now() - start)
        return ctx.body
      }
      it.t = start
    }

    // 执行controller的方法
    if (action) {
      try {
        await action(ctx, next)
      } catch (e) {
        console.error('[controller error]', e)
      }
    } else {
      ctx.body = {
        code: 406,
        data: {},
        msg: `${apiPath}的Control不存在,请在api定义中定义mock对象`
      }
    }

    routerLog(ctx.body, name || desc, apiPath, Date.now() - start)
    if (global.rtsMQ) {
      sendQueueMsg(global.rtsMQ, 'rtsApi', JSON.stringify({ key: `api:${apiPath.replace(/\//g, '_')}`, value: Date.now() - start }))
      sendQueueMsg(global.rtsMQ, 'rtsApi', JSON.stringify({ key: 'trackkey:apitotal', value: 1 }))
    } else if (global.rts) { // add stack
      global.rts.record(`api:${apiPath.replace(/\//g, '_')}`, Date.now() - start, ['count', 'max', 'min', 'avg'])
      global.rts.record('trackkey:apitotal', 1, ['count', 'max', 'min', 'avg'])
    }
    return ctx.body
  }
}

// 发送一个消息到mq队列里
async function sendQueueMsg (MQ, queueName, msg) {
  // https://github.com/squaremo/amqp.node/blob/master/examples/send_generators.js
  const ch = await MQ.createConfirmChannel()
  await ch.assertQueue(queueName)
  let r = ch.sendToQueue(queueName, Buffer.from(msg))
  await ch.waitForConfirms()
  ch.close()
  return r
}

const registerApi = (apiPath, opt) => {
  if (!opt.method) { return }

  if (api[apiPath]) {
    $.err('出现重复的api定义：', apiPath, api[apiPath])
  }

  opt.method = opt.method.toLowerCase()
  api[apiPath] = opt

  const action = limitReqAction(getApiFn(apiPath, opt), apiPath)

  if (opt.method === 'all') {
    router.get(apiPath, action)
    router.post(apiPath, action)
  } else {
    router[opt.method](apiPath, action)
  }

  checkapiStandard(apiPath, opt)
}

const checkApi = (apiDir, apiPath = '') => {
  try {
    const files = fs.readdirSync(apiDir)
    for (let i = 0; i < files.length; i++) {
      const dir = path.join(apiDir, files[i])
      const stat = fs.statSync(dir)
      if (stat.isDirectory()) { // 是文件夹
        checkApi(dir, `${apiPath}/${files[i]}`)
      } else {
        const ap = require(dir)
        for (const [p, opt] of Object.entries(ap)) {
          const path = (p.indexOf('/') === 0 ? p : `${apiPath}/${files[i].split('.')[0]}/${p}`).split('/').filter(v => !!v)
            .join('/')
          registerApi(`/${path}`, opt)
        }
      }
    }
  } catch (e) {
    $.err($.c.r(`✘ ${e.toString()}`))
  }

  // process.exit(0)
  //
  // for (const ap of Object.values(api)) {
  //   for (const [apiPath, opt] of Object.entries(ap)) {
  //     registerApi(apiPath, opt)
  //   }
  // }
}

const loadRunDict = () => { // 加载处理程序需要的数据
  if (serviceDir) {
    try {
      const S = $.requireAll(path.join(rootDir, 'service')) || {}
      Object.assign($S, S)
    } catch (e) {
      warn('引用service报错', e.stack)
    }
  }

  let [n, m, k] = [0, 0, 0]
  try {
    $S._controlCode = {}
    $S._srvCode = {}
    Object.keys($S).forEach(i => {
      $S._srvCode[i] = (++k).toString(16).padStart(2, '0')
    })

    // let file = yield fs.readFile(path.join(__dirname+'/../', '/models/dict_db.js'))
    // const dict = JSON.parse(file)
    // global.dictObj = dict
    Object.entries(api).forEach(([k, item]) => {
      m++
      const [aK] = k.split('/').filter(function (item) { return item !== '' && item !== '__swagger__' })
      if (aK) {
        $S._controlCode[k] = m.toString(36).padStart(2, '0')
      }
      if (item.front) {
        n++
        Object.values(item.param).forEach(v => {
          if (v.req === 0) { delete v.req }
          if (v.def === null) { delete v.def }
          if (v.type === 'string') { delete v.type }
        })

        frontApi[k] = { method: item.method, param: item.param }
      }
    })
  } catch (e) {
    $.err(e.stack)
  }

  // $.dir($S)

  $.log(n === 0 ? $.c.r('✘') : $.c.g('✔'), `[${$.c.y('frontApi/totlaApi')}] = [${$.c.y(`${n}/${m}`)}] Routers at [${$.c.y(controllerDir)}]`)
}

checkApi(apiRootDir)

loadRunDict()

module.exports = [router.routes(), router.allowedMethods()]
