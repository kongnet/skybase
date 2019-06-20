
const Mock = require('mockjs')

/* global $ */

module.exports = {
  async haveController (ctx) {
    ctx.ok({})
  },
  async image (ctx) {
    const { width, heigth, count, type } = ctx.checkedData.data
    let data = { list: [] }
    const Random = Mock.Random
    for (let i = 0; i < count; i++) {
      data.list.push(Random.image(`${width}x${heigth}`, Random.color(), Random.color(), type, `${width}x${heigth}`))
    }
    $.log(data)
    ctx.ok(data)
  }
}
