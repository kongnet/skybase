'use strict'
const $ = require('meeko')
const figlet = require('figlet')

const deconstructionCode = (errCode, errMsg, data) => {
  if (errCode instanceof Array) {
    ;[errCode, errMsg, data] = errCode
  } else if (errCode && Object === errCode.constructor) {
    ;({ data, msg: errMsg, code: errCode } = errCode)
  }

  if (!errCode && errCode !== 0) {
    errCode = 500
    errMsg = errMsg || 'base:unset errCode' //'未配置errCode'
  } else {
    const olderrCode = errCode
    errCode = parseInt(errCode)
    if (isNaN(errCode)) {
      console.log('【errCode配置不正确】', olderrCode)
      errCode = 500
      errMsg = errMsg || 'base: errCode setting Incorrect' //'errCode配置不正确'
    }
  }

  return { errCode, errMsg, data }
}

const appContext = {
  /**
   * 向body写入统一的数据格式
   *
   * @param errCode 消息码，此参数可以包含以下2个参数，写法1： [200,'ok',{}] 写法2：{errCode:200, errMsg:'ok', data:{}}
   * @param errMsg 消息内容
   * @param data obj 附带数据
   *
   * 最后body的数据格式为：{
   *   code: 200,
   *   msg: 'ok',
   *   data: {},
   *   t: 1538203430022
   * }
   * */

  throwCode: function (errCode, errMsg, data) {
    this.type = 'json'
    ;({ errCode, errMsg, data } = deconstructionCode(errCode, errMsg, data))

    // ps. 这里不 JSON.stringify ，就会在中间件：bodyParseFn 解析body的时候报错，
    // 那里同时处理输入和输出的数据，没法区分是输入的错还是输出的错
    try {
      this.body = {
        data: data || {},
        code: errCode,
        msg: errMsg,
        t: Number(new Date())
      }

      return this.body
    } catch (e) {
      console.error(
        this.request.url,
        { code: 500, msg: '输出的数据无法解析' },
        this.method.toLowerCase(),
        data
      )
      this.throwCode(500, 'output data parse error') //'输出的数据无法解析'
    }
  },
  ok: function (data, msg) {
    return this.throwCode(200, msg || 'ok', data)
  }
}

const errStackFn = e => {
  // let txt = e.stack.split('\n')
  // let os = process.platform
  // let f = __filename.split(os.includes('win32') ? '\\' : '/')
  // let currentFile = f[f.length - 1]
  // let pos = -1
  // for (let i = 0; i < txt.length; i++) {
  //   if (txt[i].includes(currentFile)) {
  //     pos = i
  //     break
  //   }
  // }
  $.option.logTime = false
  $.err(e.stack)
  $.option.logTime = true
}
process.on('uncaughtException', errStackFn)
process.on('unhandledRejection', errStackFn)

const artTxt = (s = 'SKY', font = 'Star Wars') =>
  $.log($.c.c(figlet.textSync(s, { font })))
const artStage = s => {
  const len = s.length + 4
  const char = '─'.times(len)
  $.log(`      +${char}+\n      │${$.c.m(`  ${s}  `)}│\n      +${char}+`)
}

module.exports = {
  ctx: appContext,
  artTxt,
  artStage
}
