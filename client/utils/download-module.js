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
      type: 'ACTIVATED_DOWNLOAD_LINK'
    })
  }
  hideDownloadLink() {
    this.props.dispatch({
      type: 'DEACTIVATED_DOWNLOAD_LINK'
    })
  }
  render() {
    return (
      <div>
        <LinkWrapper>
          <a className={this.props.isDownloadLinkActive ? '' : 'hidden'}
            ref={link => {
              this.link = link
            }}>Download Snapshot</a>
        </LinkWrapper>
        <ToggleButton id="snapshot-button" className="toggle-button"
          isActive={this.props.isDownloadLinkActive} onClick={this.handleDownloadRequest}>
          <i className={'fa fa-camera-retro transparent' + (this.props.isDownloadLinkActive ? ' active' : '')}
            aria-hidden="true"></i>
        </ToggleButton>
        <DownloadButton id="snapshot-dl-btn" className="toggle-button"
          isActive={this.props.isDownloadLinkActive} onClick={this.hideDownloadLink}>
          <i className={'fa fa-download transparent' + (this.props.isDownloadLinkActive ? ' download-active' : '')}
            aria-hidden="true"></i>
        </DownloadButton>
      </div>
    )
  }
}

const LinkWrapper = styled.div`
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 200px;
  text-align: center;
`

const ToggleButton = styled.button`
  background-color: ${props => props.isActive ? '#312c32' : '#daad86'}
`

const DownloadButton = styled.button`
  background-color: ${props => props.isActive ? '#daad86' : 'lightgrey'}
`

function mapStateToProps(state) {
  return {
    isDownloadLinkActive: state.utility.isDownloadLinkActive
  }
}

const Connected = connect(mapStateToProps)(DownloadModule)
export default Connected
