import React from 'react'
import styled from 'styled-components'

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
    this.width = 2
    this.color = null

    this.selectColor = this.selectColor.bind(this)
  }
  selectColor(event) {
    this.color = event.target.dataset.color
    this.props.updatePaintStyle(this.width, this.color)
  }
  render() {
    return (
      <div id="paint-tools">
        <div id="eraser-tool" className="toolbar-module"></div>
        <div id="line-width-tool" className="toolbar-module"></div>
        <div id="current-color-tool" className="toolbar-module"></div>
        <div id="palette-container">
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
        </div>
        <div id="eraser-label" className="toolbar-label">Eraser</div>
        <div id="line-width-label" className="toolbar-label">Size</div>
        <div id="current-color-label" className="toolbar-label">Current</div>
      </div>
    )
  }
}
