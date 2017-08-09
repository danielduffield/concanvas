require('dotenv').config()
const express = require('express')
const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)

server.listen(2000)

app.use(express.static('server/public'))

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(process.env.PORT, () => console.log('Listening on PORT...'))

io.sockets.on('connection', newConnection)

function newConnection(socket) {
  console.log('new connection: ' + socket.id)

  socket.on('mouse', getPaintData)
}

function getPaintData(data) {
  console.log(data)
}
