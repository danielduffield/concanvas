import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import DownloadModule from './download-module'

class UtilToolbar extends React.Component {
  render() {
    return (
      <div>
        <DownloadModule canvas={this.props.canvas}/>
        <ToggleButton id="unhide-button" className="toggle-button"
          isActive={!(this.props.isChatHidden && this.props.isUserListHidden)}
          onClick={this.toggleChat}>
          <i className={'fa' + (this.props.isChatHidden && this.props.isUserListHidden
            ? ' fa-envelope-o transparent'
            : ' fa-envelope-open-o transparent active')}
            aria-hidden="true"></i>
        </ToggleButton>
      </div>
    )
  }
}

const ToggleButton = styled.button`
  background-color: ${props => props.isActive ? '#312c32' : '#daad86'}
`

function mapStateToProps(state) {
  return {
    isChatHidden: state.chat.isChatHidden,
    isUserListHidden: state.chat.isUserListHidden
  }
}

const Connected = connect(mapStateToProps)(UtilToolbar)
export default Connected
