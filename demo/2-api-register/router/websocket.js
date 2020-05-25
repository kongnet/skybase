module.exports = {
  html (ctx) {
    ctx.body = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io();
  let i = 0
  setInterval(() => {
    socket.emit('chat message', i++);
  }, 2000)
  socket.on('chat message', function(msg){
    console.log(msg)
  });
</script>
</body>
</html>
    `
  }
}