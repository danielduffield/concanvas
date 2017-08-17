import React from 'react'
import styled from 'styled-components'

export default class DownloadModule extends React.Component {
  constructor(props) {
    super(props)

    this.handleDownloadRequest = this.handleDownloadRequest.bind(this)
  }
  handleDownloadRequest() {
    const canvas = document.getElementById('my-canvas')
    console.log(canvas)
    canvas.toBlob(blob => {
      console.log('blobbing it ', blob)
      const newImage = document.createElement('img')
      const url = URL.createObjectURL(blob)

      newImage.onload = () => URL.revokeObjectURL(url)

      newImage.src = url
      console.log(newImage)
    })
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
