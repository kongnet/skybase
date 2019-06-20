
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
  }
}
