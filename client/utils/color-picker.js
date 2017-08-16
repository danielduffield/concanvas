import React from 'react'
import { SketchPicker } from 'react-color'
import styled from 'styled-components'

export default class Component extends React.Component {

  render() {
    return (
      <CustomColor>
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
`
