import React from 'react'
import { connect } from 'react-redux'
import { SketchPicker } from 'react-color'
import styled from 'styled-components'

class Component extends React.Component {
  constructor(props) {
    super(props)

    this.savedColor = null

    this.saveColor = this.saveColor.bind(this)
    this.handleCustomSelection = this.handleCustomSelection.bind(this)
  }
  saveColor(color, event) {
    console.log('color saved: ', color.hex)
    this.savedColor = color.hex
  }
  handleCustomSelection(event) {
    console.log('UPDATING WITH ', this.savedColor)
    const index = this.props.customSelected
    this.props.dispatch({
      type: 'SELECTED_CUSTOM_COLOR',
      payload: { color: this.savedColor, index }
    })
    console.log('custom colors: ', this.props.customColors)
  }
  render() {
    return (
      <CustomColor isColorPickerHidden={this.props.isColorPickerHidden} onDoubleClick={this.handleCustomSelection}>
        <SketchPicker disableAlpha={true} onChange={this.saveColor}
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
