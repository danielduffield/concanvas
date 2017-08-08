import React from 'react'

export default class Canvas extends React.Component {
  constructor(props) {
    super(props)
    this.clickTimer = null
    this.canvas = null
    this.ctx = null

    this.previousX = 0
    this.previousY = 0
    this.clientX = 0
    this.clientY = 0
    this.painting = false

    this.updateCoordinates = this.updateCoordinates.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.paintEvent = this.paintEvent.bind(this)
  }
  paintEvent() {
    this.ctx = this.canvas.getContext('2d')
    this.ctx.fillStyle = '#000000'

    let x1 = this.clientX
    let x2 = this.previousX
    let y1 = this.clientY
    let y2 = this.previousY

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

    let dx = x2 - x1
    let dy = Math.abs(y2 - y1)
    let error = 0
    let de = dy / dx
    let yStep = -1
    let y = y1

    if (y1 < y2) {
      yStep = 1
    }

    const lineThickness = 2

    for (let x = x1; x < x2; x++) {
      if (steep) {
        this.ctx.fillRect(y, x, lineThickness, lineThickness)
      }
      else {
        this.ctx.fillRect(x, y, lineThickness, lineThickness)
      }

      error += de
      if (error >= 0.5) {
        y += yStep
        error -= 1.0
      }
    }
  }
  updateCoordinates(event) {
    const coordinates = getCoordinates(this.canvas, event)

    this.previousX = this.clientX
    this.previousY = this.clientY
    this.clientX = coordinates.x
    this.clientY = coordinates.y
    if (this.painting) this.paintEvent()
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
