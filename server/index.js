require('dotenv').config()
const express = require('express')
const app = express()

const server = require('http').Server(app)
const io = require('socket.io').listen(server)

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const fs = require('fs')

server.listen(process.env.PORT, () => console.log('Listening on PORT...'))

app.use(jsonParser)
app.use(express.static('server/public'))

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/saved-canvas', (req, res) => {
  readFileAsync('saved-canvas.json').then(data => {
    res.json(data)
  })
  .catch(err => res.status(500).json(err))
})

app.post('/', (req, res) => {
  console.log(req.body)
  fs.writeFile('saved-canvas.json', JSON.stringify(req.body), 'utf8').then(() => {
    console.log('SAVED!')
    res.sendStatus(201)
  })
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
