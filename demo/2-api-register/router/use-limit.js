module.exports = {
  async lock (ctx) {
    await (new Promise(resolve => setTimeout(resolve, 5000)))
    ctx.ok()
  },
  async feqLimit (ctx) {
    ctx.ok()
  }
}
