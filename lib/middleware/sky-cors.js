/**
 * 跨域
 * */

const cors = require('koa2-cors')

module.exports = cors({
  maxAge: 600
})
