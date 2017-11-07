import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import SizeSelector from './size-selector'

const paletteColors = []
const rows = 4
const columns = 3

const defaultColors = [
  ['white', 'black', 'grey'],
  ['yellow', 'orange', 'brown'],
  ['pink', 'red', 'purple'],
  ['green', 'aqua', 'blue']
]

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < columns; j++) {
    const colorInfo = {}
    colorInfo.index = [i, j]
    colorInfo.color = defaultColors[i][j]
    paletteColors.push(colorInfo)
  }
}

class PaintSidebar extends React.Component {
  constructor(props) {
    super(props)
    this.isErasing = this.props.isErasing

    this.selectColor = this.selectColor.bind(this)
    this.selectCustomColor = this.selectCustomColor.bind(this)
    this.toggleEraser = this.toggleEraser.bind(this)

    this.customSelected = null
  }
  toggleEraser() {
    this.isErasing = !this.isErasing
    if (this.isErasing) {
      this.props.dispatch({
        type: 'TOGGLED_ERASER'
      })
    }
    else {
      this.props.dispatch({
        type: 'SELECTED_COLOR',
        payload: { text: this.props.currentColor }
      })
    }
  }
  selectColor(event) {
    if (this.isErasing) this.isErasing = !this.isErasing
    this.props.dispatch({
      type: 'SELECTED_COLOR',
      payload: { text: event.target.dataset.color }
    })
  }
  selectCustomColor(event) {
    const selectedIndex = parseInt(event.target.dataset.index, 10)
    if (this.props.customSelected !== selectedIndex) {
      this.props.dispatch({
        type: 'SELECTED_CUSTOM_SLOT',
        payload: { index: parseInt(event.target.dataset.index, 10) }
      })
    }
    else {
      const color = this.props.customColors[selectedIndex]
      this.props.dispatch({
        type: 'TOGGLED_COLOR_PICKER',
        payload: { color }
      })
      document.cookie = 'concanvas_colors=' + this.getColorString()
    }
  }
  getColorString() {
    let colorString = ''
    this.props.customColors.forEach((color, index) => {
      index === 0 ? colorString += color : colorString += ',' + color
    })
    return colorString
  }
  componentDidMount() {
    const loadedColors = getColorsFromCookies()
    if (loadedColors) {
      this.props.dispatch({
        type: 'LOADED_CUSTOM_COLORS',
        payload: { colors: loadedColors }
      })
    }
  }
  render() {
    return (
      <PaintTools>
        <EraserIcon className="toolbar-module-sidebar"
          onClick={this.toggleEraser}
          isActive={this.props.isErasing}></EraserIcon>
        <div className="toolbar-label-sidebar">Eraser</div>
        <SizeSelector />
        <div className="toolbar-label-sidebar">Size</div>
        <CurrentColor className="toolbar-module-sidebar" color={this.props.currentColor}></CurrentColor>
        <div className="toolbar-label-sidebar">Current</div>
        <Palette id="sidebar-palette">
          {paletteColors.map((colorModule, index) => {
            return (
              <ColorDiv id={'color-' + colorModule.index[0] + '-' + colorModule.index[1]}
                className="color-module-sidebar" data-color={colorModule.color} onClick={this.selectColor}
                color={colorModule.color}
                key={index}></ColorDiv>
            )
          })}
          {this.props.customColors.map((colorModule, index) => {
            return (
              <ColorDiv id={'custom-color-' + index}
                className="color-module-sidebar" data-color={colorModule} onClick={this.selectCustomColor}
                color={colorModule} data-index={index}
                key={index}></ColorDiv>
            )
          })}
        </Palette>
      </PaintTools>
    )
  }
}

const ColorDiv = styled.div`
  background-color: ${props => props.color};
`

const CurrentColor = styled.div`
  background-color: ${props => props.color};
`
const EraserIcon = styled.div`
  background-color: ${props => props.isActive ? 'deeppink' : 'pink'};
`

const PaintTools = styled.div`
  float: left;
  border: 2px solid #312c32;
  border-left: none;
  height: 604px;
  width: 135px;
  margin-top: 125px;
  background-color: #daad86;
`
const Palette = styled.div`
  position: relative;
  height: 286px;
  width: 106px;
  margin: 15px auto 20px;
  background-color: gainsboro;
  border: 2px solid #312c32;
`

function getColorsFromCookies() {
  const cookieList = document.cookie
  const cookies = cookieList.split('; ').map(cookiePair => cookiePair.split('='))
  const index = cookies.findIndex(cookie => {
    return cookie[0] === 'concanvas_colors'
  })
  return index !== -1 ? cookies[index][1].split(',') : null
}

function mapStateToProps(state) {
  return {
    isErasing: state.paint.isErasing,
    color: state.paint.color,
    currentColor: state.paint.currentColor,
    customColors: state.paint.customColors,
    customSelected: state.paint.customSelected
  }
}

const Connected = connect(mapStateToProps)(PaintSidebar)

export default Connected
