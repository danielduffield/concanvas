require('dotenv').config()
const express = require('express')
const app = express()
const fs = require('fs-extra')

const server = require('http').Server(app)
const io = require('socket.io').listen(server)

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

let unsavedData = []

const currentlyOnline = []

server.listen(process.env.PORT, () => console.log('Listening on PORT...'))

app.use(jsonParser)
app.use(express.static('server/public'))

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/saved-canvas', (req, res) => {
  let canvasPath = 'canvas-state/blank.json'
  fs.ensureDir('canvas-state/instances').then(() => {
    return fs.readdir('canvas-state/instances')
  })
  .then(data => {
    if (data.length) {
      canvasPath = 'canvas-state/instances/' + data[data.length - 1]
    }
    fs.readFile(canvasPath, 'utf8').then(data => {
      res.send(data)
    })
  })
  .catch(err => res.status(500).json(err))
})

app.post('/', (req, res) => {
  fs.readdir('canvas-state/instances').then(instances => {
    if (instances.length > 10) {
      const toDelete = instances.shift()
      fs.unlink('canvas-state/instances/' + toDelete).catch(err => console.log(err))
    }
  })
  const fileId = Date.now() + '-' + req.body.socketId
  fs.writeFile('canvas-state/instances/canvas-' + fileId + '.json', JSON.stringify(req.body))
    .then(() => {
      console.log('Canvas Saved')
      unsavedData = []
      res.sendStatus(201)
    })
    .catch(err => console.log(err))
})

io.sockets.on('connection', newConnection)

function newConnection(socket) {
  console.log('User ' + socket.id + ' connected')
  socket.emit('connectionId', socket.id)
  socket.on('nickname', updateUserList)

  socket.emit('unsavedData', unsavedData)
  socket.on('mouse', getPaintData)
  socket.on('chat', broadcastChat)
  socket.on('disconnect', handleUserDisconnect)

  function updateUserList(data) {
    let nickname
    if (data === 'GUEST') nickname = data + '(' + socket.id.substr(0, 4) + ')'
    else nickname = data

    const user = { socketId: socket.id, nickname: nickname }
    const userIndex = currentlyOnline.findIndex(user => user.socketId === socket.id)

    if (userIndex === -1) {
      currentlyOnline.push(user)
      const chatEvent = { type: 'connected', user }
      io.sockets.emit('chatEvent', chatEvent)
    }
    else currentlyOnline[userIndex].nickname = data

    console.log('Currently Online: ', currentlyOnline)
    io.sockets.emit('userlist', currentlyOnline)
  }

  function handleUserDisconnect() {
    console.log('User ' + socket.id + ' disconnected')
    const userIndex = currentlyOnline.findIndex(user => user.socketId === socket.id)
    let chatEvent = { type: 'disconnected' }
    if (userIndex !== -1) {
      chatEvent.nickname = currentlyOnline.splice(userIndex, 1)
    }
    console.log('Currently Online: ', currentlyOnline)
    io.sockets.emit('chatEvent', chatEvent)
    io.sockets.emit('userlist', currentlyOnline)
  }

  function getPaintData(data) {
    socket.broadcast.emit('mouse', data)
    console.log(data)
    unsavedData.push(data)
  }

  function broadcastChat(data) {
    data.locallySubmitted = false
    socket.broadcast.emit('chat', data)
  }
}
