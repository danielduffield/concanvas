import React from 'react'
import { connect } from 'react-redux'
import { SketchPicker } from 'react-color'
import styled from 'styled-components'

class Component extends React.Component {
  constructor(props) {
    super(props)

    this.getColorString = this.getColorString.bind(this)
    this.toggleColorPicker = this.toggleColorPicker.bind(this)
    this.handleCustomSelection = this.handleCustomSelection.bind(this)
  }
  getColorString() {
    let colorString = ''
    this.props.customColors.forEach((color, index) => {
      index === 0 ? colorString += color : colorString += ',' + color
    })
    return colorString
  }
  toggleColorPicker() {
    console.log(this.props.customColors)
    const color = this.props.customColors[this.props.customSelected]
    this.props.dispatch({
      type: 'TOGGLED_COLOR_PICKER',
      payload: { color }
    })
  }
  handleCustomSelection(color, event) {
    const index = this.props.customSelected
    this.props.dispatch({
      type: 'SELECTED_CUSTOM_COLOR',
      payload: { color: color.hex, index }
    })
    document.cookie = 'concanvas_colors=' + this.getColorString()
  }
  render() {
    return (
      <CustomColor isColorPickerHidden={this.props.isColorPickerHidden} onDoubleClick={this.toggleColorPicker}>
        <SketchPicker disableAlpha={true} onChange={this.handleCustomSelection}
          color={this.props.customColors[this.props.customSelected]} />
      </CustomColor>
    )
  }
}

const CustomColor = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  display: ${props => props.isColorPickerHidden ? 'none' : ''};
`

function mapStateToProps(state) {
  return {
    isColorPickerHidden: state.paint.isColorPickerHidden,
    customColors: state.paint.customColors,
    customSelected: state.paint.customSelected
  }
}

const Connected = connect(mapStateToProps)(Component)
export default Connected
