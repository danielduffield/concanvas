import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

class DownloadModule extends React.Component {
  constructor(props) {
    super(props)

    this.link = null
    this.button = null
    this.handleDownloadRequest = this.handleDownloadRequest.bind(this)
    this.hideDownloadLink = this.hideDownloadLink.bind(this)
  }
  canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => resolve(blob))
    })
  }
  downloadCanvas(link, canvas, filename) {
    link.href = canvas.toDataURL()
    link.download = filename
  }
  handleDownloadRequest() {
    this.downloadCanvas(this.link, this.props.canvas, 'snapshot.png')
    this.props.dispatch({
      type: 'TOGGLED_DOWNLOAD_LINK'
    })
  }
  hideDownloadLink(event) {
    if (!this.props.isDownloadLinkActive) event.preventDefault()
    this.props.dispatch({
      type: 'DEACTIVATED_DOWNLOAD_LINK'
    })
  }
  render() {
    return (
      <div>
        <ToggleButton id="snapshot-button" className="toggle-button" title="Capture Snapshot"
          isActive={this.props.isDownloadLinkActive} onClick={this.handleDownloadRequest}>
          <i className={'fa fa-camera-retro transparent' + (this.props.isDownloadLinkActive ? ' active' : ' inactive')}
            aria-hidden="true"></i>
        </ToggleButton>
        <a title="Download Snapshot" id="snapshot-dl-btn"
          className={'toggle-button' + (this.props.isDownloadLinkActive ? '' : ' disabled')} onClick={this.hideDownloadLink}
          ref={link => {
            this.link = link
          }}>
          <i className={'fa fa-download transparent' + (this.props.isDownloadLinkActive ? ' download-active' : ' download-inactive')}
            aria-hidden="true"></i>
        </a>
      </div>
    )
  }
}

const ToggleButton = styled.a`
  background-color: ${props => props.isActive ? '#312c32' : '#daad86'}
  background-color: whitesmoke;
`

function mapStateToProps(state) {
  return {
    isDownloadLinkActive: state.utility.isDownloadLinkActive
  }
}

const Connected = connect(mapStateToProps)(DownloadModule)
export default Connected
