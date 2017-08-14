import React from 'react'

import Canvas from './canvas'
import ChatSidebar from './chat-sidebar'

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.updateChatStatus = this.updateChatStatus.bind(this)
    this.state = {
      isChatHidden: false
    }
  }
  updateChatStatus(status) {
    this.setState({ isChatHidden: status })
  }
  render() {
    return (
      <div>
        <ChatSidebar updateChatStatus={this.updateChatStatus}/>
        <Canvas isChatHidden={this.state.isChatHidden}/>
      </div>
    )
  }
}
