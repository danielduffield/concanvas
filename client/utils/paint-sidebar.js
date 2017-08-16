import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import SizeSelector from './size-selector'

const paletteColors = []
const rows = 4
const columns = 3

const customColors = []
const customRows = 2

const defaultColors = [
  ['white', 'black', 'grey'],
  ['yellow', 'orange', 'brown'],
  ['pink', 'red', 'purple'],
  ['green', 'aqua', 'blue']
]

const customDefaults = [
  ['whitesmoke', 'whitesmoke', 'whitesmoke'],
  ['whitesmoke', 'whitesmoke', 'whitesmoke']
]

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < columns; j++) {
    const colorInfo = {}
    colorInfo.index = [i, j]
    colorInfo.color = defaultColors[i][j]
    paletteColors.push(colorInfo)
  }
}

for (let i = 0; i < customRows; i++) {
  for (let j = 0; j < columns; j++) {
    const colorInfo = {}
    colorInfo.index = [i, j]
    colorInfo.color = customDefaults[i][j]
    customColors.push(colorInfo)
  }
}

class PaintSidebar extends React.Component {
  constructor(props) {
    super(props)
    this.color = this.props.color
    this.isErasing = this.props.isErasing

    this.selectColor = this.selectColor.bind(this)
    this.selectCustomColor = this.selectCustomColor.bind(this)
    this.toggleEraser = this.toggleEraser.bind(this)
  }
  toggleEraser() {
    this.isErasing = !this.isErasing
    this.props.dispatch({
      type: 'TOGGLED_ERASER'
    })
  }
  selectColor(event) {
    this.color = event.target.dataset.color
    if (this.isErasing) this.isErasing = !this.isErasing
    this.props.dispatch({
      type: 'SELECTED_COLOR',
      payload: { text: event.target.dataset.color }
    })
  }
  selectCustomColor(event) {
    console.log('custom selection')
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
        <CurrentColor className="toolbar-module-sidebar" color={this.color}></CurrentColor>
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
          {customColors.map((colorModule, index) => {
            return (
              <ColorDiv id={'custom-color-' + colorModule.index[0] + '-' + colorModule.index[1]}
                className="color-module-sidebar" data-color={colorModule.color} onClick={this.selectCustomColor}
                color={colorModule.color}
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
  border: 2px solid black;
  border-left: none;
  height: 604px;
  width: 135px;
  margin-top: 125px;
  background-color: palegoldenrod;
`
const Palette = styled.div`
  position: relative;
  height: 286px;
  width: 106px;
  margin: 15px auto 20px;
  background-color: gainsboro;
  border: 2px solid black;
`

function mapStateToProps(state) {
  return {
    isErasing: state.paint.isErasing,
    color: state.paint.color
  }
}

const Connected = connect(mapStateToProps)(PaintSidebar)

export default Connected
