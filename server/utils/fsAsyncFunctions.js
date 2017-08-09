const fs = require('fs')

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

module.exports = {
  readFileAsync,
  writeFileAsync,
  readdirAsync,
  unlinkAsync
}
