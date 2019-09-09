
// NOTICE: 经过body格式格式化一下内容才可对象化
const $ = require('meeko')
const { bodyParse } = require('../../skyconfig')
const skyBodyParse = require('koa-better-body')
const convert = require('koa-convert')
const bodyParseFn = convert(skyBodyParse(bodyParse))

module.exports = async (ctx, next) => {
  try {
    await bodyParseFn(ctx, next)
  } catch (e) {
    // 有时候能进到这来，有时候又不能，神奇。
    $.err('用户输入错误', e)
    $.err('用户输入错误e.type', e.type)
    $.err('用户输入错误e.message', e.message)
    $.err('用户输入错误e.message', e.stack)
    switch (e.type) {
      case 'entity.too.large':
        ctx.throwCode(413, 'request entity too large')
        break
      default:
        ctx.throwCode(400, e.message)
    }
  }
}
