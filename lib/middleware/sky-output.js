/**
 * 记录api运行前后的状态，并封装到response中
 * */

const $G = global.$G = global.$G || {}
const $ = require('meeko')

// 是否停止接收新的网络请求。如果设为 true ，来了新请求，还是会先判断参数是否正确，是否登录，然后返回 503
$G.stopNewRequest = false

// 拦截最后的返回
const interceptLastReturn = (ctx) => {
  switch (ctx.status) {
    case 200:
      break
    case 204:
      ctx.throwCode(204, 'sys:无内容返回')
      break
    case 405:
      ctx.throwCode(405, 'sys:无访问api权限')
      break
    case 404:
      // ctx.throwCode.call(ctx, 404, 'sys:无此api或api发生错误', '', ctx)
      ctx.throwCode(404, 'sys:无此api或api发生错误')
      break
    case 401:
      ctx.throwCode(401, 'sys:无权限')
      break
    default:
      ctx.throwCode(ctx.status, 'sys:服务端未知错误')
  }
}

module.exports = async (ctx, next) => {
  // (1) 进入路由
  const start = Date.now()
  try {
    if ($G.stopNewRequest) {
      ctx.throwCode(503, '服务端暂时停止服务，请稍后再试')
    } else {
      await next()
    }
  } catch (e) {
    $.err(e.stack)
    switch (true) {
      case e.message.indexOf('ETIMEDOUT') > -1:
        ctx.throwCode(599, '服务端超时')
        break
      case e.message.indexOf('ENOENT') > -1:
        ctx.throwCode(598, '服务端找不到路径')
        break
      case e.message === 'request entity too large':
        ctx.throwCode(413, `请求体过大：${e.length} / ${e.limit} 字节`)
        break
      default:
        ctx.throwCode(500, e.message, e)
    }
  }

  // (5) 再次进入 x-response-time 中间件，记录2次通过此中间件「穿越」的时间
  let ms = Date.now() - start
  // this.response.type = 'html' //总体控制mime
  ctx.set('X-Response-Time', ms + 'ms')

  // 这个功能很久没用了，注释掉
  // if (aModule.includes('track')) {
  //   let url = ctx.request.url
  //   let _url = url.split('?')[0].split('/')
  //   if (api[_url[1]] && Pro.track.apiTrack) {
  //     req.post({
  //         url: `${Pro.track.host}/chart/apirecord`,
  //         form: { k: _url.join('_'), v: ms },
  //         json: true
  //       },
  //       function (e, d) {
  //         // $.dir(d.body)
  //       })
  //   }
  // }
  interceptLastReturn(ctx)

  /* this.set('token','kongxiangfeng');
  this.type = 'json'; */
  // (6) 返回 this.body
}
