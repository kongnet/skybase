
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
  async three (ctx) {
    const r = await testService.three(ctx.checkedData.data)
    if (r && r.code === 0) {
      ctx.throwCode(200, '成功', r.data)
    } else {
      ctx.throwCode(r.code, r.msg)
    }
  },
  async four (ctx) {
    const r = await testService.four(ctx.checkedData.data)
    if (r && r.code === 0) {
      ctx.throwCode(200, '成功', r.data)
    } else {
      ctx.throwCode(r.code, r.msg)
    }
  }

}
