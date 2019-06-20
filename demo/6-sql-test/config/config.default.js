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

  mysqlMain: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'new_super_ip',
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

  redisMain: {
    host: 'localhost',
    port: 6379,
    auth: '',
    db: 2
  },

  rabbitMQ: {
    protocol: 'amqp',
    host: 'localhost',
    port: '5672'
    // login: 'admin',
    // password: 'rabbitmq@jiatui',
    // vhost: ''
  },

  kafka: {
    host: '10.0.2.31:9092,172.16.64.35:9092',
    topic: 'appRequest'
  }
}
