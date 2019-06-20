const path = require('path')
const packageJson = require('../package')
module.exports = {
  name: packageJson.name,
  rootDir: path.join(__dirname, '../'),
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
  },

  redis: {
    host: 'localhost',
    port: 6379,
    auth: '',
    db: 1
  },

  rabbitMQ: {
    protocol: 'amqp',
    host: 'localhost',
    port: '5672'
    // login: 'admin',
    // password: 'rabbitmq@jiatui',
    // vhost: ''
  }
}
