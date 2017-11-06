import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import PaintSidebar from './paint-sidebar'
import ColorPicker from './color-picker'
import DownloadModule from './download-module'

import socket from './socket-connection'

class Canvas extends React.Component {
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

    this.lastSaved = null
    this.painting = false
    this.unsavedData = []

    this.toggleChat = this.toggleChat.bind(this)
    this.updateCoordinates = this.updateCoordinates.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.paintEvent = this.paintEvent.bind(this)
    this.loadCanvas = this.loadCanvas.bind(this)
  }
  componentDidMount() {
    socket.on('mouse', data => this.paintEvent(data.x, data.y, data.prevX, data.prevY, data.size, data.color))
    socket.on('connectionId', id => {
      this.props.dispatch({
        type: 'SOCKET_ESTABLISHED',
        payload: { text: id }
      })
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
          body: JSON.stringify({ saved, socketId: this.props.socketId })
        })
        console.log(response)
      }
      this.lastSaved = saved
    }, 10000)
  }
  toggleChat() {
    this.props.dispatch({ type: 'TOGGLED_CHAT' })
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
        size: this.props.size,
        color: this.props.color
      }
      socket.emit('mouse', paintData)

      this.paintEvent(this.clientX, this.clientY, this.previousX, this.previousY, this.props.size, this.props.color)
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
      <Container id="container" isHidden={this.props.isChatHidden && this.props.isUserListHidden}>
        <SecondWrapper isHidden={this.props.isChatHidden && this.props.isUserListHidden}>
          <Wrapper id="wrapper">
            <MainTitle id="main-title">ConCanvas</MainTitle>
            <canvas id="my-canvas" onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}
              onMouseMove={this.updateCoordinates} onMouseOut={this.handleMouseUp}
              width="600" height="600"
              ref={canvas => {
                this.canvas = canvas
              }}>
            </canvas>
            <PaintSidebar />
            <ColorPicker/>
          </Wrapper>
        </SecondWrapper>
        <DownloadModule canvas={this.canvas}/>
        <ToggleButton id="unhide-button"
          isActive={!(this.props.isChatHidden && this.props.isUserListHidden)}
          onClick={this.toggleChat}>
          <i className={'fa' + (this.props.isChatHidden && this.props.isUserListHidden
            ? ' fa-envelope-o transparent'
            : ' fa-envelope-open-o transparent active')}
            aria-hidden="true"></i>
        </ToggleButton>
        <ToggleButton id="snapshot-button"
          isActive={this.props.isDownloadLinkActive}>
          <i className={'fa fa-camera-retro transparent' + (this.props.isDownloadLinkActive ? ' active' : '')}
            aria-hidden="true"></i>
        </ToggleButton>
      </Container>
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

const ToggleButton = styled.button`
  width: 100px;
  height: 100px;
  z-index: 10;
  font-size: 4.5em;
  background-color: ${props => props.isActive ? '#312c32' : '#daad86'}
`

const SecondWrapper = styled.div`
    position: relative;
    height: 100%;
    width: ${props => props.isHidden ? '704px' : '80%'};
    margin: 0 auto;
`

const Container = styled.div`
  height: 100%;
  position: absolute;
  left: ${props => props.isHidden ? 0 : '34%'};
  width: ${props => props.isHidden ? '100%' : '66%'};
`

const MainTitle = styled.h1`
  width: 300px;
  top: 25px;
  font-size: 4em;
  font-family: 'Bubblegum Sans', cursive;
  left: 0;
  right: 25%;
  position: absolute;
  margin: 0 auto;
  background-color: whitesmoke;
`

const Wrapper = styled.div`
  min-width: 960px;
  position: absolute;
`

function mapStateToProps(state) {
  return {
    color: state.paint.color,
    size: state.paint.size,
    isErasing: state.paint.isErasing,
    isChatHidden: state.chat.isChatHidden,
    isUserListHidden: state.chat.isUserListHidden,
    socketId: state.chat.socketId,
    isDownloadLinkActive: state.utility.isDownloadLinkActive
  }
}

const Connected = connect(mapStateToProps)(Canvas)
export default Connected
