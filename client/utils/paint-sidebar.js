import React from 'react'
import styled from 'styled-components'

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
      <PaintTools>
        <EraserIcon className="toolbar-module-sidebar"
          onClick={this.toggleEraser}></EraserIcon>
        <div className="toolbar-label-sidebar">Eraser</div>
        <div className="toolbar-module-sidebar"></div>
        <div className="toolbar-label-sidebar">Size</div>
        <CurrentColor className="toolbar-module-sidebar"></CurrentColor>
        <div className="toolbar-label-sidebar">Current</div>
        <Palette id="sidebar-palette">
          {paletteColors.map((colorModule, index) => {
            const ColorDiv = styled.div`
              background-color: ${colorModule.color};
            `
            return (
              <ColorDiv id={'color-' + colorModule.index[0] + '-' + colorModule.index[1]}
                className="color-module-sidebar" data-color={colorModule.color} onClick={this.selectColor}
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
  border: 2px solid black;
  border-left: none;
  height: 604px;
  width: 135px;
  margin-top: 100px;
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
