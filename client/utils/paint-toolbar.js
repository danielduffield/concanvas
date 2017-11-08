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
      <PaintTools isHoriz={this.props.isToolbarHoriz}>
        <ModuleContainer isHoriz={this.props.isToolbarHoriz}>
          <EraserIcon className="toolbar-module-sidebar"
            onClick={this.toggleEraser}
            isActive={this.props.isErasing}></EraserIcon>
          <div className="toolbar-label-sidebar">Eraser</div>
        </ModuleContainer>
        <ModuleContainer isHoriz={this.props.isToolbarHoriz}>
          <SizeSelector />
          <div className="toolbar-label-sidebar">Size</div>
        </ModuleContainer>
        <ModuleContainer isHoriz={this.props.isToolbarHoriz}>
          <CurrentColor className="toolbar-module-sidebar" color={this.props.currentColor}></CurrentColor>
          <div className="toolbar-label-sidebar">Current</div>
        </ModuleContainer>
        <Palette id="sidebar-palette" isHoriz={this.props.isToolbarHoriz}>
          {paletteColors.map((colorModule, index) => {
            return (
              <ColorDiv id={'color-' + colorModule.index[0] + '-' + colorModule.index[1]}
                 isHoriz={this.props.isToolbarHoriz} data-color={colorModule.color} onClick={this.selectColor}
                color={colorModule.color}
                key={index}></ColorDiv>
            )
          })}
          {this.props.customColors.map((colorModule, index) => {
            return (
              <ColorDiv id={'custom-color-' + index} isHoriz={this.props.isToolbarHoriz}
                data-color={colorModule} onClick={this.selectCustomColor}
                color={colorModule} data-index={index}
                key={index}></ColorDiv>
            )
          })}
        </Palette>
      </PaintTools>
    )
  }
}

const PaintTools = styled.div`
  float: left;
  border: 2px solid #312c32;
  border-top: ${props => props.isHoriz ? 'none' : '2px solid #312c32'};
  border-left: ${props => props.isHoriz ? '2px solid #312c3' : 'none'};
  height: ${props => props.isHoriz ? '135px' : '604px'};
  width: ${props => props.isHoriz ? '604px' : '135px'};
  margin-top: ${props => props.isHoriz ? '0' : '125px'};
  background-color: #daad86;
`

const ModuleContainer = styled.div`
  float: ${props => props.isHoriz ? 'left' : 'none'};
  margin: ${props => props.isHoriz ? '13px 0 0 10px' : '0 auto'};
  background-color: #daad86;
`

const EraserIcon = styled.div`
  background-color: ${props => props.isActive ? 'deeppink' : 'pink'};
`

const CurrentColor = styled.div`
  background-color: ${props => props.color};
`

const Palette = styled.div`
  position: relative;
  height: ${props => props.isHoriz ? '106px' : '286px'};
  width: ${props => props.isHoriz ? '286px' : '106px'};
  float: ${props => props.isHoriz ? 'left' : 'none'};
  margin: ${props => props.isHoriz ? '15px 0 20px 13px' : '15px auto 20px'};
  background-color: gainsboro;
  border: 2px solid #312c32;
`

const ColorDiv = styled.div`
  border: 2px solid #312c32;
  float: left;
  height: 26px;
  width: 26px;
  margin: ${props => props.isHoriz ? '7px 0 0 18px' : '14px 4px 5px'};
  background-color: lightblue;
  background-color: ${props => props.color};
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
    customSelected: state.paint.customSelected,
    isToolbarHoriz: state.utility.isToolbarHoriz
  }
}

const Connected = connect(mapStateToProps)(PaintSidebar)

export default Connected
