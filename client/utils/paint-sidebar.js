import React from 'react'
import styled from 'styled-components'

import SizeSelector from './size-selector'

const paletteColors = []
const rows = 6
const columns = 3

const defaultColors = [
  ['white', 'black', 'grey'],
  ['yellow', 'orange', 'brown'],
  ['pink', 'red', 'purple'],
  ['green', 'aqua', 'blue'],
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

export default class PaintSidebar extends React.Component {
  constructor(props) {
    super(props)
    this.color = '#000000'
    this.state = {
      color: this.color,
      erasing: false
    }
    this.selectColor = this.selectColor.bind(this)
    this.toggleEraser = this.toggleEraser.bind(this)
  }
  toggleEraser() {
    if (this.state.erasing) {
      this.setState({ color: this.color, erasing: false })
      this.props.updateColor(this.color)
    }
    else {
      this.setState({ color: '#FFFFFF', erasing: true })
      this.props.updateColor('#FFFFFF')
    }
  }
  selectColor(event) {
    this.color = event.target.dataset.color
    this.setState({ color: this.color, erasing: false })
    this.props.updateColor(this.color)
  }
  render() {
    return (
      <PaintTools>
        <EraserIcon className="toolbar-module-sidebar"
          onClick={this.toggleEraser}
          isActive={this.state.erasing}></EraserIcon>
        <div className="toolbar-label-sidebar">Eraser</div>
        <SizeSelector updateBrushSize={this.props.updateBrushSize}/>
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
