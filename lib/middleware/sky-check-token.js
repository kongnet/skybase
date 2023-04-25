/**
 * 检查token
 * */

/* global $ redis */
const Config = require('../../skyconfig')
module.exports = async (ctx, next) => {
  let needToken = ctx.apiSetting.token
  if (needToken) {
    const token = ctx.header.token
    if (token) {
      const data = await checkToken(token)
      if (!data && needToken) {
        $.log(token + ' 非法用户')
        return ctx.throwCode(401, 'base:pls login!') //'请登录!'
      }
      ctx.checkedToken = data
      if (data && ctx.checkedData) {
        ctx.checkedData.token = true
      }
    } else {
      $.log('接口需要token')
      return ctx.throwCode(401, 'base:need token or no login') //'需要token,或需登录'
    }
  } else {
    // 兼容微服务
    ctx.checkedToken = { headers: ctx.request.headers }
  }
  next && (await next())
}

// // 删除原先的登录凭证
// async function delOldToken (id) {
//   let ot = await redis.get(Config.tokenName + ':id:' + id)
//   if (ot && ot.length > 13) {
//     await redis.del(Config.tokenName + ':userlogin:' + ot)
//   }
// }

// // 创建token 以id 并且设定用户数据
// async function setToken (obj) { // obj - 存放对象
//   try {
//     let s = obj.id + ' ' + +new Date()
//     let token = Crypto.createHmac('sha256', s.slice(0, 5)).update(s).digest('base64')
//     let keyStr = Config.tokenName + ':userlogin:' + token
//     if (await redis.setex(keyStr, tokenSaveTime, JSON.stringify(obj)) === 'OK') { // 保存2个小时
//       // 删除原先的登录凭证
//       await delOldToken(obj.id)
//       // 设定新的登录凭证
//       await redis.set(Config.tokenName + ':id:' + obj.id, token)
//       return token
//     }
//     return -1
//   } catch (e) {
//     $.err(e)
//     return -1
//   }
// }

async function checkToken (token, tokenPre = 'userlogin') {
  try {
    let keyStr = Config.tokenName + ':' + tokenPre + ':' + token
    keyStr = keyStr.trim()
    let o = JSON.parse(await redis.get(keyStr))
    $.log(keyStr, o)
    if (o === null) {
      return 0
    }
    if (o.id) {
      let ot = await redis.get(Config.tokenName + ':id:' + o.id)
      if (ot !== token) {
        return 0
      }
    } else {
      return 0
    }
    switch (tokenPre) {
      case 'userlogin':
        return o.id ? o : 0
      default:
        break
    }
    return 0
  } catch (e) {
    $.err(e.stack)
    return 0
  }
}
