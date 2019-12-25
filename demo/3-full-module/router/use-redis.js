module.exports = {
  async api1 (ctx) {
    const {key, val} = ctx.checkedData.data

    await global.redis.setex(key, 1, val)
    const v = await global.redis.get(key)

    if (v === val) {
      ctx.ok()
    } else {
      ctx.throwCode(0, '失败')
    }
  }
}
