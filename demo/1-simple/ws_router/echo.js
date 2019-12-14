module.exports = (io) => {
  io.on('echo', async (ctx, data) => {
    // let req_data = data[0]
    // let user = client[ctx.conn.id]
    // console.log(req_data, user)
    // $.log($.c.g('✔'), data)
    ctx.socket.emit('svrEcho', 'server echo')
  })
}
