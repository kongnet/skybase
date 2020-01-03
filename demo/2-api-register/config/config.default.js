const path = require('path')
const packageJson = require('../package')
module.exports = {
  name: packageJson.name,
  rootDir: path.join(__dirname, '../'),

  // 重定向配置，逻辑放在中间件 sky-check-param 内，所以必须要使用该中间件，此功能才生效
  redirect: {
    '/redirect/original': '/redirect/to'
  },

  mysql: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'test',
    pool: 1000,
    timeout: 60000,
    charset: 'utf8mb4',
    multipleStatements: true,
    connectionLimit: 1000,
    showSql: true // 使用BaseModel的才有效，打印sql
  }
}
