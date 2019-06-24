
const testService = require('../service/test.js')

module.exports = {
  async one (ctx) {
    const r = await testService.one(ctx.checkedData.data)
    if (r && r.code === 0) {
      ctx.throwCode(200, '成功', r.data)
    } else {
      ctx.throwCode(r.code, r.msg)
    }
  },
  async two (ctx) {
    const r = await testService.two(ctx.checkedData.data)
    if (r && r.code === 0) {
      ctx.throwCode(200, '成功', r.data)
    } else {
      ctx.throwCode(r.code, r.msg)
    }
  },
  async testErrCode (ctx) {
    ctx.throwCode(null, '测试')
  },
  async testErrCodeArr (ctx) {
    ctx.throwCode([200, 'test', {}], '测试')
  },
  async testErrCodeObj (ctx) {
    ctx.throwCode({ constructor: Object }, '测试')
  },
  async testErrCodeErr (ctx) {
    ctx.throwCode({ constructor: {} }, '测试')
  },
  async testErr (ctx) {
    let t = 0
    try {
      t = 123 / t
    } catch (error) {
      console.error(error.stack)
    }
    console.log(t)
    ctx.throwCode(500, '测试')
  }
}
