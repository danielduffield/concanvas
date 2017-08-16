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
    this.color = this.props.color
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
        payload: { text: this.color }
      })
    }
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
    this.props.dispatch({
      type: 'REVEALED_COLOR_PICKER',
      payload: { index: parseInt(event.target.dataset.index, 10) }
    })
    console.log(event.target.dataset.index)
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
    color: state.paint.color,
    customColors: state.paint.customColors,
    customSelected: state.paint.customSelected
  }
}

const Connected = connect(mapStateToProps)(PaintSidebar)

export default Connected
