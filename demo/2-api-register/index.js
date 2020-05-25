const sky = require('../../index')
const config = require('./config')

// websocket 应用
config.afterCreateServer = async (server) => {
  const io = require('socket.io')(server)
  io.on('connection', (socket) => {
    console.log('user connected')
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg)
      io.emit('chat message', msg)
    })
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })

  console.info('ws服务启动成功')
}

sky.start(config, async () => {
  console.log('项目成功启动')
})
