/**
 * 检查参数
 * */

const $ = require('meeko')
const $G = global.$G = global.$G || {}
const api = $G.api = $G.api || {}

const config = require('../../skyconfig')

const apiCheckLog = function (url, obj, method, oldParam, ctx) {
  if (config.logger) {
    let checkColor = 'c'
    obj = obj || {}
    if (obj.code >= 400) { checkColor = 'y' }
    let methodStr = method.toUpperCase()
    $.log($.c[{ 'GET': 'dimg', 'POST': 'dimy' }[methodStr]](`[ ${methodStr} ]`) + $.c.dimy(url.join ? url.join('/') : url) + $.c[checkColor](JSON.stringify(obj || '{}')), '实际参数:', oldParam ? $.c.r(JSON.stringify(oldParam || '{}')) : '', 'header参数:', $.c.c(JSON.stringify(ctx.header || '{}')))
  }
}

// 重定向
const checkRedirect = (ctx, apiPath) => {
  if (config.redirect) {
    let url = config.redirect[apiPath] || null
    if (url) { // 跳转
      if (ctx.request.header) {
        url = `${ctx.request.header['x-forwarded-prefix'] || ''}${url}`
      }
      $.log(apiPath, ' redirect ', url)
      ctx.redirect(url)
      return true
    }
  }
  return false
}

const checkCache = (ctx, method, url) => {
  const cacheName = method + url
  if ($G.cache[cacheName]) {
    ctx.type = 'json'
    ctx.body = $G.cache[cacheName]
    $.log('CACHE..', url)
    return true
  }
  return false
}

// 快速检查是否可以不执行具体方法
const preCheck = (ctx, method, url, apiPath) => {
  if (!['get', 'post'].includes(method)) {
    ctx.throwCode(ctx.status, '只支持get/post方式')
    return { succ: false, continue: false }
  }
  if (checkRedirect(ctx, apiPath)) {
    return { succ: true, continue: false }
  }
  if (apiPath.includes('favicon.ico')) {
    return { succ: true, continue: false }
  }
  if (checkCache(ctx, method, url)) {
    return { succ: true, continue: false }
  }

  let apiSetting = api[apiPath]
  //NOTICE: 支持动态路由，但找不到的时候性能有点损失
  if (!apiSetting) {
    apiSetting = api[Object.keys(api).find(x => x.includes(':')
      && new RegExp(x.replace(/(:[0-9a-z]+)/g, '[0-9a-z]+'), 'g').test(apiPath))]
  }
  if (!apiSetting) {
    ctx.throwCode(404, '接口不存在')
    return { succ: false, continue: false }
  }

  const needMethod = apiSetting.method
  if (method !== needMethod && needMethod !== 'all') { // 允许get和post都接入
    $.err(`方法类型不对，应为${needMethod}，不能为${method}`)
    ctx.throwCode(405, '方法类型不对')
    return { succ: false, continue: false }
  }

  return { succ: true, continue: true, needMethod, apiSetting }
}

module.exports = async (ctx, next) => {
  const method = ctx.method.toLowerCase()
  const url = ctx.request.url
  const apiPath = url.split('?')[0]
  const { continue: canContinue, succ, needMethod, apiSetting } = preCheck(ctx, method, url, apiPath)
  if (!canContinue) {
    apiCheckLog(apiPath, ctx.body, method, null, ctx)
    return succ ? 1 : 0
  }

  ctx.apiSetting = apiSetting

  const params = method === 'get' ? ctx.query || {} : ctx.request.fields || ctx.body || {}

  // 下面是原来有的逻辑，感觉不安全，所以去掉了
  // NOTICE 如果是上传文件不过滤参数 参数里有files的即为上传
  // if (method === 'post' && params.files) {
  //   ctx.checkedData = {
  //     code: 200,
  //     msg: '',
  //     data: params
  //   }
  // }

  ctx.checkedData = $.tools.checkParam(params, needMethod === 'all' && apiSetting.param[method] || apiSetting.param)
  apiCheckLog(apiPath, ctx.checkedData, method, params, ctx)
  if (ctx.checkedData.code >= 400) {
    return ctx.throwCode(400, ctx.checkedData.msg)
  }
  await next()
}
