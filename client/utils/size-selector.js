import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

class SizeSelector extends React.Component {
  constructor(props) {
    super(props)
    this.currentIndex = 0
    this.validSizes = [2, 5, 10, 15]
    this.nextBiggerSize = this.nextBiggerSize.bind(this)
    this.nextSmallerSize = this.nextSmallerSize.bind(this)
  }
  nextBiggerSize() {
    if (this.validSizes[this.currentIndex + 1]) {
      this.props.dispatch({
        type: 'SELECTED_SIZE',
        payload: { text: this.validSizes[this.currentIndex + 1] }
      })
      this.currentIndex++
    }
  }
  nextSmallerSize() {
    if (this.validSizes[this.currentIndex - 1]) {
      this.props.dispatch({
        type: 'SELECTED_SIZE',
        payload: { text: this.validSizes[this.currentIndex - 1] }
      })
      this.currentIndex--
    }
  }
  render() {
    return (
      <LineWidthModule className="toolbar-module-sidebar">
        <SizeCounterContainer>
          <SizeCounter id="size-counter">{this.props.size}</SizeCounter>
        </SizeCounterContainer>
        <div className="float-right">
          <SizeButton id="increment-btn" onClick={this.nextBiggerSize}>+</SizeButton>
          <SizeButton id="decrement-btn" onClick={this.nextSmallerSize}>-</SizeButton>
        </div>
      </LineWidthModule>
    )
  }
}

const SizeCounter = styled.div`
  position: relative;
  top: 15px;
  display: inline-block;
  font-size: 2em;
`

const SizeCounterContainer = styled.div`
  padding-left: 5px;
  height: 62px;
  width: 40px;
  text-align: center;
  float: left;
`

const SizeButton = styled.button`
  width: 32px;
  display: block;
  height: 31px;
`

const LineWidthModule = styled.div`
  width: 86px;
  height: 66px;
`

function mapStateToProps(state) {
  return {
    size: state.paint.size
  }
}

const Connected = connect(mapStateToProps)(SizeSelector)
export default Connected
