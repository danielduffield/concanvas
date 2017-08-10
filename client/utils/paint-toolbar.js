import React from 'react'

const paletteColors = []
const rows = 3
const columns = 6

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < columns; j++) {
    paletteColors.push([i, j])
  }
}

export default class PaintToolbar extends React.Component {
  render() {
    return (
      <div id="paint-tools">
        <div id="eraser-tool" className="toolbar-module"></div>
        <div id="line-width-tool" className="toolbar-module"></div>
        <div id="current-color-tool" className="toolbar-module"></div>
        <div id="palette-container">
          {paletteColors.map((colorModule, index) => {
            return (
              <div id={'color-' + colorModule[0] + '-' + colorModule[1]}
                className="color-module" key={index}></div>
            )
          })}
        </div>
        <div id="eraser-label" className="toolbar-label">Eraser</div>
        <div id="line-width-label" className="toolbar-label">Brush Size</div>
        <div id="current-color-label" className="toolbar-label">Current</div>
      </div>
    )
  }
}
