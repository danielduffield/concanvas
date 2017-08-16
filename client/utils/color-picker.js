import React from 'react'
import { connect } from 'react-redux'
import { SketchPicker } from 'react-color'
import styled from 'styled-components'

class Component extends React.Component {
  constructor(props) {
    super(props)

    this.toggleColorPicker = this.toggleColorPicker.bind(this)
    this.handleCustomSelection = this.handleCustomSelection.bind(this)
  }
  toggleColorPicker() {
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
    let colorString = ''
    this.props.customColors.forEach((color, index) => {
      index === 0 ? colorString += color : colorString += ',' + color
    })
    document.cookie = 'concanvas_colors=' + colorString
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
  position: relative;
  top: 430px;
  right: 357px;
  float: left;
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
