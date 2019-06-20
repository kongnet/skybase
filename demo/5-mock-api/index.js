const sky = require('../../index')
const config = require('./config')

sky.start(config, async () => {
  console.log('项目成功启动')
})
