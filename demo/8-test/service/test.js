/**
 * @author: cuiguanghao
 * @date: 2019年06月10日08:37:23
 * @name: api.js
 * @description: 生成api文档
 */

/* global db redis */

const Package = require('../package.json')

module.exports = {
  one,
  two
}

async function two (arg) {
  let r = await redis.set(`${Package.name}:${arg.name}`, 'redis ' + new Date().date2Str())
  return {
    code: 0,
    data: {
      redis: r
    }
  }
}

async function one (arg) {
  let r = await db.admin_user.R({ d_flag: 0 }, {}, {}, 1).run()
  return {
    code: 0,
    data: {
      db: r
    }
  }
}
