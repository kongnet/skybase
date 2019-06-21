/**
 * 注册api
 * */
const $G = global.$G = global.$G || {}
const fs = require('fs')
const path = require('path')
const $ = require('meeko')
const Mock = require('mockjs')
Mock.Random.extend($.Mock)
let mockFn = {
  noMock () {
    return function (ctx) {
      ctx.ok('controller未定义 & mock未定义')
    }
  },
  mockRouter (mockModels) {
    return function (ctx) {
      ctx.ok(Mock.mock(mockModels))
    }
  },
  mock (mockModels) {
    return Mock.mock(mockModels)
  }
}

const skyExt = require('../sky_extend')
const router = require('koa-router')()
const { routerDir, rootDir, apiDir, logger } = require('../../config')

const apiStat = $G.apiStat = {}// 接口各种状态

const frontApi = $G.frontApi = {} // 推送给前端的接口定义

skyExt.artStage(`API Checking`)

const controllerDir = path.join(rootDir, routerDir || 'router')

const apiRootDir = path.resolve(rootDir, apiDir)
const api = $G.api = $G.api || {}
const $S = $G.$S = $G.$S || {}

const limitReqAction = (action, apiPath) => async function (ctx, next) {
  const start = Date.now()

  const [, a] = apiPath.split('/')
  const { feqLimit, name, desc } = (api[a] && api[a][apiPath]) || {}

  do {
    // 接口频率控制
    if (+feqLimit > 0) {
      const it = apiStat[apiPath] = apiStat[apiPath] || { n: 1, t: 0 }
      it.n++
      const diff = start - it.t
      it.t = start
      if ((1 / feqLimit * 1000) > diff) {
        ctx.body = {
          code: 402,
          data: diff,
          msg: '访问过快请稍后再试！'
        }
        break
      }
    }

    // 执行controller的方法
    if (action) {
      await action(ctx, next)
    } else {
      ctx.body = {
        code: 406,
        data: {},
        msg: `${apiPath}的Control不存在,请创建/model/mock.js并编写Mock数据`
      }
    }
  } while (false)

  if (logger) {
    $.log('[router处理]=>', ctx.body, `\n${$.c.dimc(name || (desc || '') + apiPath)} => ${$.c.dimc(Date.now() - start)} ms`)
  }
  return ctx.body
}

const registerApi = (apiPath, opt) => {
  if (!opt.method) return
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

  let [file, fn] = ['', '']
  if (mockModel) {
    file = '../model/mock.js'
    fn = mockModel === 1 ? 'mockRouter' : 'noMock'
  } else {
    let tmpL = opt.controller.split('.')
    file = tmpL[0]
    fn = tmpL[1]
  }

  let func
  try {
    // const contr = require(path.resolve(rootDir, controllerDir, file)) || {}
    func = mockFn[fn]
    if (mockModel) {
      func = func(opt.mock)
    }
  } catch (e) {
    $.log($.c.r('✘'), apiPath.fillStr(' ', 30), $.c.r(`不存在 ${file}`))
    $.log(e.stack)
  }

  if (!func) {
    $.log($.c.r('✘'), apiPath.fillStr(' ', 30), $.c.r(`不存在 ${opt.controller}`))
  }

  if (api[apiPath]) {
    $.err('出现重复的api定义：', apiPath, api[apiPath])
  }
  api[apiPath] = opt

  opt.method = opt.method.toLowerCase()
  const action = limitReqAction(func, apiPath)

  if (opt.method === 'all') {
    router.get(apiPath, action)
    router.post(apiPath, action)
  } else {
    router[opt.method](apiPath, action)
  }

  // 检查接口定义是否规范，不规范也不会出错，只会打印提示
  const apiDesc = opt.name || opt.desc
  if (!apiDesc) {
    $.log($.c.y('?'), apiPath.fillStr(' ', 30), $.c.y('接口未写名称或描述'))
  } else if (apiPath.includes('_')) {
    $.log($.c.y('?'), apiPath.fillStr(' ', 30), $.c.y('接口命名不规范'))
  }
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
          const path = (p.indexOf('/') === 0 ? p : `${apiPath}/${files[i].split('.')[0]}/${p}`).split('/').filter(v => !!v).join('/')
          registerApi(`/${path}`, opt)
        }
      }
    }
  } catch (e) {
    $.err(e.stack)
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
  try {
    const S = $.requireAll(path.join(rootDir, 'service')) || {}
    Object.assign($S, S)
  } catch (e) {}

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
          if (v.req === 0) delete v.req
          if (v.def === null) delete v.def
          if (v.type === 'string') delete v.type
        })

        frontApi[k] = { method: item.method, param: item.param }
      }
    })
  } catch (e) {
    $.err(e.stack)
  }

  // $.dir($S)

  $.log(n === 0 ? $.c.r('✘') : $.c.g('✔'), `[${$.c.yellow}${n}/${m}${$.c.none}] Routers at [${$.c.yellow}${controllerDir}${$.c.none}]`)
}

checkApi(apiRootDir)

loadRunDict()

module.exports = [router.routes(), router.allowedMethods()]
