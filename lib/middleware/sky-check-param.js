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
    if (obj.code >= 400) checkColor = 'yellow'
    $.log($.c.dimc(method.toUp()) + $.c.dimy(url.join ? url.join('/') : url) + $.c[checkColor], obj, $.c.none)
  }
}

module.exports = async (ctx, next) => {
  const method = ctx.method.toLowerCase()
  if (!['get', 'post'].includes(method)) {
    ctx.throwCode(ctx.status, '只支持get/post方式')
    return 0
  }
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
    }
  }
  const url = ctx.request.url
  if ($G.cache[method + url]) {
    ctx.type = 'json'
    ctx.body = $G.cache[method + url]
    $.log('CACHE..', url)
    return 1
  }
  const _url = url.split('?')[0]
  if (_url.includes('favicon.ico')) {
    return 0
  }

  const _api = api[_url]
  if (_api) {
    ctx.apiSetting = _api

    const needMethod = _api.method.toLow()
    if (method !== needMethod && needMethod !== 'all') { // 允许get和post都接入
      $.err(`方法类型不对，应为${needMethod}，不能为${method}`)
      ctx.throwCode(405, `方法类型不对`)
      return 0
    }

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

    ctx.checkedData = $.tools.checkParam(params, (_api.method.toLow() === 'all' && _api.param[method]) || _api.param)
    apiCheckLog(_url, { ...ctx.checkedData, ...(ctx.checkedData.code >= 400 ? { param: params } : {}) }, method)
    if (ctx.checkedData.code >= 400) {
      ctx.throwCode(400, ctx.checkedData.msg)
    } else {
      await next()
    }
  } else {
    ctx.throwCode(404, '接口不存在')
  }
}
