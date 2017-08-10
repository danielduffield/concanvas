require('dotenv').config()
const express = require('express')
const app = express()
const fs = require('fs-extra')

const server = require('http').Server(app)
const io = require('socket.io').listen(server)

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

let unsavedData = []

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
    console.log(instances.length)
    if (instances.length > 10) {
      const toDelete = instances.shift()
      fs.unlink('canvas-state/instances/' + toDelete).then(() => {
        console.log('Oldest instance deleted')
      })
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
  socket.emit('connectionId', socket.id)
  socket.emit('unsavedData', unsavedData)
  socket.on('mouse', getPaintData)

  function getPaintData(data) {
    socket.broadcast.emit('mouse', data)
    console.log(data)
    unsavedData.push(data)
  }
}
