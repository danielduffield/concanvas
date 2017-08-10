require('dotenv').config()
const express = require('express')
const app = express()

const server = require('http').Server(app)
const io = require('socket.io').listen(server)

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

let unsavedData = []

const { readFileAsync, writeFileAsync, readdirAsync, unlinkAsync } = require('./utils/fsAsyncFunctions')

server.listen(process.env.PORT, () => console.log('Listening on PORT...'))

app.use(jsonParser)
app.use(express.static('server/public'))

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/saved-canvas', (req, res) => {
  let canvasPath = 'canvas-state/blank.json'
  readdirAsync('canvas-state/instances').then(data => {
    if (data.length) {
      canvasPath = 'canvas-state/instances/' + data[data.length - 1]
    }
    readFileAsync(canvasPath).then(data => {
      res.json(data)
    })
  })
  .catch(err => res.status(500).json(err))
})

app.get('/test-stroke', (req, res) => {
  readFileAsync('canvas-state/test-stroke.json').then(data => {
    res.send(data)
  })
})

app.post('/', (req, res) => {
  readdirAsync('canvas-state/instances').then(data => {
    console.log(data.length)
    if (data.length > 10) {
      const toDelete = data.shift()
      unlinkAsync('canvas-state/instances/' + toDelete).then(() => {
        console.log('Oldest instance deleted')
      })
    }
  })
  const fileId = Date.now() + '-' + req.body.socketId
  writeFileAsync('canvas-state/instances/canvas-' + fileId + '.json', JSON.stringify(req.body))
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
