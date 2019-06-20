module.exports = {
  async api1 (ctx) {
    const { name } = ctx.checkedData.data
    ctx.throwCode(200, '成功', {
      name: name
    })
  }
}
