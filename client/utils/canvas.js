import React from 'react'

import PaintToolbar from './paint-toolbar'

import io from 'socket.io-client'
const socket = io.connect()

export default class Canvas extends React.Component {
  constructor(props) {
    super(props)
    this.saveTimer = null
    this.clickTimer = null
    this.canvas = null
    this.ctx = null

    this.previousX = 0
    this.previousY = 0
    this.clientX = 0
    this.clientY = 0
    this.lineWidth = 2
    this.currentColor = null

    this.lastSaved = null
    this.painting = false
    this.socketId = null
    this.unsavedData = []

    this.updateCoordinates = this.updateCoordinates.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.paintEvent = this.paintEvent.bind(this)
    this.loadCanvas = this.loadCanvas.bind(this)
    this.updateColor = this.updateColor.bind(this)
  }
  updateColor(color) {
    this.currentColor = color
  }
  componentDidMount() {
    socket.on('mouse', data => this.paintEvent(data.x, data.y, data.prevX, data.prevY, data.size, data.color))
    socket.on('connectionId', id => {
      this.socketId = id
    })
    socket.on('unsavedData', data => {
      this.unsavedData = data
      this.loadCanvas()
    })

    this.saveTimer = setInterval(async () => {
      const saved = this.canvas.toDataURL()

      if (this.lastSaved !== saved) {
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ saved, socketId: this.socketId })
        })
        console.log(response)
      }
      this.lastSaved = saved
    }, 10000)
  }
  async loadCanvas() {
    this.ctx = this.canvas.getContext('2d')
    this.ctx.fillStyle = '#000000'
    const img = new Image()
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0)
    }
    const response = await fetch('/saved-canvas')
    const canvasData = await response.json()
    img.src = canvasData.saved
    this.lastSaved = canvasData.saved
    console.log(this.unsavedData)
    this.unsavedData.forEach(mark => this.paintEvent(mark.x, mark.y, mark.prevX, mark.prevY, mark.size, mark.color))
    this.unsavedData = []
  }
  paintEvent(mouseX, mouseY, previousX, previousY, width, color) {

    this.ctx.fillStyle = color

    let x1 = mouseX
    let x2 = previousX
    let y1 = mouseY
    let y2 = previousY

    const steep = (Math.abs(y2 - y1) > Math.abs(x2 - x1))
    if (steep) {
      let x = x1
      x1 = y1
      y1 = x

      let y = y2
      y2 = x2
      x2 = y
    }
    if (x1 > x2) {
      let x = x1
      x1 = x2
      x2 = x

      let y = y1
      y1 = y2
      y2 = y
    }

    let differenceX = x2 - x1
    let differenceY = Math.abs(y2 - y1)
    let error = 0
    let slope = differenceY / differenceX
    let yStep = -1
    let y = y1

    if (y1 < y2) {
      yStep = 1
    }

    for (let x = x1; x < x2; x++) {
      steep
      ? this.ctx.fillRect(y, x, width, width)
      : this.ctx.fillRect(x, y, width, width)

      error += slope
      if (error >= 0.5) {
        y += yStep
        error -= 1.0
      }
    }
  }
  updateCoordinates(event) {
    const coordinates = getCoordinates(this.canvas, event)

    this.previousX = this.clientX ? this.clientX : coordinates.x
    this.previousY = this.clientY ? this.clientY : coordinates.y

    this.clientX = coordinates.x
    this.clientY = coordinates.y
    if (this.painting) {
      const paintData = {
        x: this.clientX,
        y: this.clientY,
        prevX: this.previousX,
        prevY: this.previousY,
        size: 2,
        color: this.currentColor
      }
      socket.emit('mouse', paintData)

      this.paintEvent(this.clientX, this.clientY, this.previousX, this.previousY, this.lineWidth, this.currentColor)
    }
  }
  handleMouseDown(event) {
    this.painting = true
  }
  handleMouseUp(event) {
    this.painting = false
  }
  render() {
    return (
      <div id="container">
        <canvas id="my-canvas" onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}
          onMouseMove={this.updateCoordinates} onMouseOut={this.handleMouseUp}
          width="600" height="600"
          ref={canvas => {
            this.canvas = canvas
          }}>
        </canvas>
        <PaintToolbar updateColor={this.updateColor}/>
      </div>
    )
  }
}

function getCoordinates(canvas, event) {
  var rect = canvas.getBoundingClientRect()
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
}
