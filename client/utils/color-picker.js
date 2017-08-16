import React from 'react'
import { connect } from 'react-redux'
import { SketchPicker } from 'react-color'
import styled from 'styled-components'

class Component extends React.Component {
  constructor(props) {
    super(props)

    this.handleCustomSelection = this.handleCustomSelection.bind(this)
  }
  handleCustomSelection(color, event) {
    const index = this.props.customSelected
    console.log('index ', index)
    this.props.dispatch({
      type: 'SELECTED_CUSTOM_COLOR',
      payload: { color: color.hex, index }
    })
    console.log('custom colors: ', this.props.customColors)
    console.log('color hex: ', color.hex)
  }
  render() {
    return (
      <CustomColor isColorPickerHidden={this.props.isColorPickerHidden}>
        <SketchPicker disableAlpha={true} onChangeComplete={this.handleCustomSelection}/>
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
