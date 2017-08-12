import React from 'react'
import styled from 'styled-components'

import SizeSelector from './size-selector'

const paletteColors = []
const rows = 3
const columns = 6

const defaultColors = [
  ['black', 'brown', 'orange', 'red', 'pink', 'purple'],
  ['white', 'grey', 'yellow', 'green', 'aqua', 'blue'],
  ['whitesmoke', 'whitesmoke', 'whitesmoke', 'whitesmoke', 'whitesmoke', 'whitesmoke']
]

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < columns; j++) {
    const colorInfo = {}
    colorInfo.index = [i, j]
    colorInfo.color = defaultColors[i][j]
    paletteColors.push(colorInfo)
  }
}

export default class PaintToolbar extends React.Component {
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
    if (this.state.erasing) this.setState({ color: this.color, erasing: false })
    else this.setState({ color: '#FFFFFF', erasing: true })
  }
  selectColor(event) {
    this.color = event.target.dataset.color
    this.setState({ color: this.color, erasing: false })
    this.props.updateColor(this.state.color)
  }
  render() {
    this.props.updateColor(this.state.color)
    const CurrentColor = styled.div`
      background-color: ${this.color};
    `
    const EraserIcon = styled.div`
      background-color: ${this.state.erasing ? 'deeppink' : 'pink'};
    `
    return (
      <PaintTools id="paint-tools">
        <EraserIcon id="eraser-tool" className="toolbar-module" onClick={this.toggleEraser}></EraserIcon>
        <SizeSelector updateBrushSize={this.props.updateBrushSize}/>
        <CurrentColor id="current-color-tool" className="toolbar-module"></CurrentColor>
        <PaletteContainer id="palette-container">
          {paletteColors.map((colorModule, index) => {
            const ColorDiv = styled.div`
              background-color: ${colorModule.color};
            `
            return (
              <ColorDiv id={'color-' + colorModule.index[0] + '-' + colorModule.index[1]}
                className="color-module" data-color={colorModule.color} onClick={this.selectColor}
                key={index}></ColorDiv>
            )
          })}
        </PaletteContainer>
        <div id="eraser-label" className="toolbar-label">Eraser</div>
        <div id="line-width-label" className="toolbar-label">Size</div>
        <div id="current-color-label" className="toolbar-label">Current</div>
      </PaintTools>
    )
  }
}

const PaintTools = styled.div`
  margin: 0 auto;
  border: 2px solid black;
  width: 604px;
  height: 135px;
  background-color: palegoldenrod;
`
const PaletteContainer = styled.div`
  border: 2px solid black;
  width: 290px;
  height: 110px;
  background-color: gainsboro;
  float: left;
  margin: 10px 10px 10px 25px;
`
