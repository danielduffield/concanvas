import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import DownloadModule from './download-module'

class UtilToolbar extends React.Component {
  constructor(props) {
    super(props)

    this.toggleChat = this.toggleChat.bind(this)
    this.rotateToolbar = this.rotateToolbar.bind(this)
  }
  toggleChat() {
    this.props.dispatch({ type: 'TOGGLED_CHAT' })
  }
  rotateToolbar() {
    this.props.dispatch({ type: 'UPDATED_TOOLBAR_ORIENTATION' })
  }
  render() {
    return (
      <ToolbarContainer isHoriz={this.props.isToolbarHoriz}>
        <ButtonsWrapper isHoriz={this.props.isToolbarHoriz}>
          <ToggleButton id="unhide-button" className="toggle-button" title="Toggle Chat"
            isActive={!(this.props.isChatHidden && this.props.isUserListHidden)}
            onClick={this.toggleChat}>
            <i className={this.props.isChatHidden && this.props.isUserListHidden
              ? 'fa fa-envelope-o transparent inactive'
              : 'fa fa-envelope-o transparent active'}
              aria-hidden="true"></i>
          </ToggleButton>
          <ToggleButton className="toggle-button" title="Toggle Toolbar Position"
            onClick={this.rotateToolbar} ia-hidden="true">
            <i className={this.props.isToolbarHoriz
              ? 'fa fa-rotate-90 fa-window-maximize transparent inactive'
              : 'fa fa-rotate-180 fa-window-maximize transparent inactive'
            }></i>
          </ToggleButton>
          <DownloadModule canvas={this.props.canvas}/>
        </ButtonsWrapper>
      </ToolbarContainer>
    )
  }
}

const ToolbarContainer = styled.div`
  height: ${props => props.isHoriz ? '135px' : '604px'};
  width: ${props => props.isHoriz ? '604px' : '135px'};
  margin-top: ${props => props.isHoriz ? '0' : '125px'};
  text-align: center;
  float: ${props => props.isHoriz ? 'none' : 'left'}
`

const ButtonsWrapper = styled.div`
  background-color: lightblue;
  margin: 0 auto;
`

const ToggleButton = styled.a`
  background-color: ${props => props.isActive ? '#312c32' : '#daad86'}
  background-color: whitesmoke;
`

function mapStateToProps(state) {
  return {
    isChatHidden: state.chat.isChatHidden,
    isUserListHidden: state.chat.isUserListHidden,
    isToolbarHoriz: state.utility.isToolbarHoriz
  }
}

const Connected = connect(mapStateToProps)(UtilToolbar)
export default Connected
