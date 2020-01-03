module.exports = {
  original (ctx) {
    ctx.ok({}, '我是原地址')
  },
  to (ctx) {
    ctx.ok({}, '我是重定向后地址')
  }
}
