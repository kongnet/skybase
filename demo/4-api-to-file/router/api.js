
const ApiService = require('../service/api.js')

module.exports = {
  async list (ctx) {
    const r = await ApiService.list(ctx.checkedData.data)
    if (r && r.code === 0) {
      ctx.throwCode(200, '成功', r.data)
    } else {
      ctx.throwCode(r.code, r.msg)
    }
  },
  async info (ctx) {
    const r = await ApiService.info(ctx.checkedData.data)
    if (r && r.code === 0) {
      ctx.throwCode(200, '成功', r.data)
    } else {
      ctx.throwCode(r.code, r.msg)
    }
  },
  async update (ctx) {
    const r = await ApiService.update(ctx.checkedData.data)
    if (r && r.code === 0) {
      ctx.throwCode(200, '成功', r.data)
    } else {
      ctx.throwCode(r.code, r.msg)
    }
  },
  async output (ctx) {
    const r = await ApiService.output(ctx.checkedData.data)
    if (r && r.code === 0) {
      ctx.throwCode(200, '成功', r.data)
    } else {
      ctx.throwCode(r.code, r.msg)
    }
  }
}
