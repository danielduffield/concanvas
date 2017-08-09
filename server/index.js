require('dotenv').config()
const express = require('express')
const app = express()

const server = require('http').Server(app)
const io = require('socket.io').listen(server)

server.listen(process.env.PORT, () => console.log('Listening on PORT...'))

app.use(express.static('server/public'))

app.get('/', (req, res) => res.send('Hello World!'))

io.sockets.on('connection', newConnection)

function newConnection(socket) {
  console.log('new connection: ' + socket.id)
  socket.on('mouse', getPaintData)

  function getPaintData(data) {
    socket.broadcast.emit('mouse', data)
    console.log(data)
  }
}
