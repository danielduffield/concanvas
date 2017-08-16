import React from 'react'
import { connect } from 'react-redux'
import { SketchPicker } from 'react-color'
import styled from 'styled-components'

class Component extends React.Component {
  render() {
    return (
      <CustomColor isColorPickerHidden={this.props.isColorPickerHidden}>
        <SketchPicker />
      </CustomColor>
    )
  }
}

const CustomColor = styled.div`
  position: relative;
  top: 428px;
  right: 357px;
  float: left;
  display: ${props => props.isColorPickerHidden ? 'none' : ''};
`

function mapStateToProps(state) {
  return {
    isColorPickerHidden: state.paint.isColorPickerHidden
  }
}

const Connected = connect(mapStateToProps)(Component)
export default Connected
