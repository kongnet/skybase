/**
 * 检查参数
 * */
const $ = require('meeko')
const $G = global.$G = global.$G || {}
const api = $G.api = $G.api || {}

const config = require('../../config')

const apiCheckLog = function (url, obj, method) {
  if (config.logger) {
    let checkColor = 'white'
    if (obj.code >= 400) {checkColor = 'yellow'}
    $.log($.c.dimc(method.toUp()) + $.c.dimy(url.join ? url.join('/') : url) + $.c[checkColor], obj, $.c.none)
  }
}

const checkRedirect = (ctx) => {
  if (global.coreConfig && global.coreConfig.apiChange) {
    let url = ctx.request.url
    let _url = url.split('?')[0].split('/')
    let r = global.coreConfig.apiChange[_url[1]] || null
    if (r) { // 跳转
      let url = r
      if (ctx.request.header) {
        url = `${ctx.request.header['x-forwarded-prefix'] || ''}${r}`
      }
      $.log(_url[1], ' redirect ', url)
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
const preCheck = (ctx) => {
  const method = ctx.method.toLowerCase()
  if (!['get', 'post'].includes(method)) {
    ctx.throwCode(ctx.status, '只支持get/post方式')
    return {succ: false, continue: false}
  }
  if(checkRedirect(ctx)){
    return {succ: true, continue: false}
  }
  const url = ctx.request.url
  if(checkCache(ctx, method, url)){
    return {succ: true, continue: false}
  }
  const _url = url.split('?')[0]
  if (_url.includes('favicon.ico')) {
    return {succ: true, continue: false}
  }

  const apiSetting = api[_url]
  if (!apiSetting) {
    ctx.throwCode(404, '接口不存在')
    return {succ: false, continue: false}
  }

  const needMethod = apiSetting.method
  if (method !== needMethod && needMethod !== 'all') { // 允许get和post都接入
    $.err(`方法类型不对，应为${needMethod}，不能为${method}`)
    ctx.throwCode(405, '方法类型不对')
    return {succ: false, continue: false}
  }

  return {succ: true, continue: true, method, url: _url, needMethod, apiSetting}
}

module.exports = async (ctx, next) => {
  const {continue: canContinue, succ, needMethod, method, url, apiSetting} = preCheck(ctx)
  if(!canContinue){
    apiCheckLog(url, ctx.body, method)
    return succ ? 1 : 0
  }

  ctx.apiSetting = apiSetting

  const params = method === 'get' ? (ctx.query || {}) : (ctx.request.fields || ctx.body || {})

  // 下面是原来有的逻辑，感觉不安全，所以去掉了
  // NOTICE 如果是上传文件不过滤参数 参数里有files的即为上传
  // if (method === 'post' && params.files) {
  //   ctx.checkedData = {
  //     code: 200,
  //     msg: '',
  //     data: params
  //   }
  // }

  ctx.checkedData = $.tools.checkParam(params, (needMethod === 'all' && apiSetting.param[method]) || apiSetting.param)
  if (ctx.checkedData.code >= 400) {
    apiCheckLog(url, { ...ctx.checkedData, param: params }, method)
    return ctx.throwCode(400, ctx.checkedData.msg)
  }
  apiCheckLog(url, ctx.checkedData, method)
  await next()
}
