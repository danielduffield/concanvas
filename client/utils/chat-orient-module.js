import React from 'react'
import styled from 'styled-components'

import { connect } from 'react-redux'

class ChatOrientModule extends React.Component {
  toggleChat = () => {
    this.props.dispatch({ type: 'TOGGLED_CHAT' })
  }
  rotateToolbar = () => {
    this.props.dispatch({ type: 'UPDATED_TOOLBAR_ORIENTATION' })
  }
  render() {
    return (
      <div>
        <ToggleButton id="unhide-button" className="toggle-button" title="Toggle Chat"
          isActive={!(this.props.isChatHidden && this.props.isUserListHidden)}
          onClick={this.toggleChat}>
          <i className={`fa fa-envelope-o transparent
              ${this.props.isChatHidden && this.props.isUserListHidden ? 'inactive' : 'active'}`}
            aria-hidden="true" />
        </ToggleButton>
        <ToggleButton className="toggle-button" title="Rotate Paint Toolbar"
          onClick={this.rotateToolbar} ia-hidden="true">
          <i className={`fa fa-rotate-90 fa-window-maximize transparent
              ${this.props.isToolbarHoriz ? ' inactive' : 'inactive'}`}
          />
        </ToggleButton>
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
    isChatHidden: state.chat.isChatHidden,
    isUserListHidden: state.chat.isUserListHidden,
    isToolbarHoriz: state.utility.isToolbarHoriz
  }
}

const Connected = connect(mapStateToProps)(ChatOrientModule)
export default Connected
