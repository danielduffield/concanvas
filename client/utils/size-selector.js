import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import store from './store'

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
      store.dispatch({
        type: 'SELECTED_SIZE',
        payload: { text: this.validSizes[this.currentIndex + 1] }
      })
      this.currentIndex++
    }
  }
  nextSmallerSize() {
    if (this.validSizes[this.currentIndex - 1]) {
      store.dispatch({
        type: 'SELECTED_SIZE',
        payload: { text: this.validSizes[this.currentIndex - 1] }
      })
      this.currentIndex--
    }
  }
  render() {
    return (
      <div className="line-width-module toolbar-module-sidebar">
        <div className="size-counter-container">
          <SizeCounter id="size-counter" className="size-tool">{this.props.size}</SizeCounter>
        </div>
        <div className="size-button-container">
          <button id="increment-btn" className="size-button" onClick={this.nextBiggerSize}>+</button>
          <button id="decrement-btn" className="size-button" onClick={this.nextSmallerSize}>-</button>
        </div>
      </div>
    )
  }
}

const SizeCounter = styled.div`
  position: relative;
  top: 15px;
`

function mapStateToProps(state) {
  return {
    size: state.paint.size
  }
}

const Connected = connect(mapStateToProps)(SizeSelector)
export default Connected
