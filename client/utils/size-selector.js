import React from 'react'

export default class SizeSelector extends React.Component {
  constructor(props) {
    super(props)
    this.currentIndex = 0
    this.validSizes = ['2', '5', '10', '15']
    this.state = {
      size: 2
    }
    this.nextBiggerSize = this.nextBiggerSize.bind(this)
    this.nextSmallerSize = this.nextSmallerSize.bind(this)
  }
  nextBiggerSize() {
    if (this.validSizes[this.currentIndex + 1]) {
      this.setState({ size: this.validSizes[this.currentIndex + 1] })
      this.currentIndex++
    }
  }
  nextSmallerSize() {
    if (this.validSizes[this.currentIndex - 1]) {
      this.setState({ size: this.validSizes[this.currentIndex - 1] })
      this.currentIndex--
    }
  }
  render() {
    return (
      <div className="line-width-module toolbar-module">
        <div className="size-counter-container">
          <div id="size-counter" className="size-tool">{this.state.size}</div>
        </div>
        <div className="size-button-container">
          <button id="increment-btn" className="size-button" onClick={this.nextBiggerSize}>+</button>
          <button id="decrement-btn" className="size-button" onClick={this.nextSmallerSize}>-</button>
        </div>
      </div>
    )
  }
}