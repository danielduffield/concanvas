import React from 'react'
import styled from 'styled-components'

export default class DownloadModule extends React.Component {
  constructor(props) {
    super(props)

    this.handleDownloadRequest = this.handleDownloadRequest.bind(this)
  }
  canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => resolve(blob))
    })
  }
  async handleDownloadRequest() {
    const canvas = document.getElementById('my-canvas')
    const blob = await this.canvasToBlob(canvas)
    console.log('blobbing it ', blob)
    const newImage = document.createElement('img')
    const url = URL.createObjectURL(blob)

    newImage.onload = () => URL.revokeObjectURL(url)
    newImage.src = url

    console.log(newImage)
    const response = await fetch('/snapshot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })
    console.log(response)
  }
  render() {
    return (
      <div>
        <DownloadButton className="chat-button"
          onClick={this.handleDownloadRequest}>Download Snapshot</DownloadButton>
      </div>
    )
  }
}

const DownloadButton = styled.button`
  margin: 0;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 200px;
  height: 50px;
  z-index: 10;
`
