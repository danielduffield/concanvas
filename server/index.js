require('dotenv').config()
const express = require('express')
const app = express()

const server = require('http').Server(app)
const io = require('socket.io').listen(server)

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const fs = require('fs')

let currentCanvas = null

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

app.post('/', (req, res) => {
  readdirAsync('canvas-state/instances').then(data => {
    console.log(data)
    currentCanvas = data[data.length - 1]
    console.log(currentCanvas)
    const toDelete = data.shift()
    unlinkAsync('canvas-state/instances/' + toDelete).then(() => {
      console.log('DELETED ', toDelete)
    })
  })
  writeFileAsync('canvas-state/instances/canvas-' + Date.now() + '.json', JSON.stringify(req.body))
    .then(() => {
      console.log('SAVED!')
      res.sendStatus(201)
    })
    .catch(err => console.log(err))
})

io.sockets.on('connection', newConnection)

function newConnection(socket) {
  console.log('new connection: ' + socket.id)
  socket.on('mouse', getPaintData)

  function getPaintData(data) {
    socket.broadcast.emit('mouse', data)
    console.log(data)
  }
}

function readFileAsync(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

function writeFileAsync(fileName, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, data, 'utf8', (err) => {
      if (err) return reject(err)
      else return resolve()
    })
  })
}

function readdirAsync(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) return reject(err)
      return resolve(files)
    })
  })
}

function unlinkAsync(path) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) return reject(err)
      return resolve()
    })
  })
}
