import React from 'react'

export default class Canvas extends React.Component {
  constructor(props) {
    super(props)
    this.clickTimer = null
    this.canvas = null
    this.state = {
      clientX: 0,
      clientY: 0,
      painting: false
    }
    this.updateCoordinates = this.updateCoordinates.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
  }
  updateCoordinates(event) {
    const coordinates = getCoordinates(this.canvas, event)
    this.setState({ clientX: coordinates.x, clientY: coordinates.y, painting: this.state.painting })
  }
  handleMouseDown(event) {
    this.clickTimer = setInterval(() => {
      console.log(this.state)
      this.setState({ clientX: this.state.clientX, clientY: this.state.clientY, painting: true })
    }, 100)
  }
  handleMouseUp(event) {
    clearInterval(this.clickTimer)
    this.setState({ clientX: this.state.clientX, clientY: this.state.clientY, painting: false })
  }
  render() {
    return (
      <div id="container">
        <canvas id="my-canvas" onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}
          onMouseMove={this.updateCoordinates} onMouseOut={this.handleMouseUp}
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
