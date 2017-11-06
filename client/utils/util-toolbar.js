import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import DownloadModule from './download-module'

class UtilToolbar extends React.Component {
  constructor(props) {
    super(props)

    this.toggleChat = this.toggleChat.bind(this)
  }
  toggleChat() {
    this.props.dispatch({ type: 'TOGGLED_CHAT' })
  }
  render() {
    return (
      <ToolbarContainer>
        <ButtonsWrapper>
          <ToggleButton id="unhide-button" className="toggle-button"
            isActive={!(this.props.isChatHidden && this.props.isUserListHidden)}
            onClick={this.toggleChat}>
            <i className={'fa' + (this.props.isChatHidden && this.props.isUserListHidden
              ? ' fa-envelope-o transparent'
              : ' fa-envelope-open-o transparent active')}
              aria-hidden="true"></i>
          </ToggleButton>
          <DownloadModule canvas={this.props.canvas}/>
        </ButtonsWrapper>
      </ToolbarContainer>
    )
  }
}

const ToolbarContainer = styled.div`
  position: relative;
  width: 100%;
  text-align: center;
`

const ButtonsWrapper = styled.div`
  width: 700px;
  height: 154px;
  margin: 0 auto;
`

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