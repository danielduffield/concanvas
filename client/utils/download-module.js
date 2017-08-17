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
  handleDownloadRequest() {
    const canvas = document.getElementById('my-canvas')
    const link = document.createElement('a')
    link.textContent = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    document.body.appendChild(link)
    function downloadCanvas(link, canvasId, filename) {
      link.href = canvas.toDataURL()
      link.download = filename
    }
    downloadCanvas(link, canvas, 'snapshot.png')

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
