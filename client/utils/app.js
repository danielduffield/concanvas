import React from 'react'

import Canvas from './canvas'
import ChatSidebar from './chat-sidebar'

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.updateChatStatus = this.updateChatStatus.bind(this)
    this.updateSocketId = this.updateSocketId.bind(this)
    this.state = {
      isChatHidden: true,
      socketId: null
    }
  }
  updateChatStatus(status) {
    this.setState({ isChatHidden: status, socketId: this.state.socketId })
  }
  updateSocketId(id) {
    this.setState({ isChatHidden: this.state.isChatHidden, socketId: id })
  }
  render() {
    return (
      <div>
        <ChatSidebar updateChatStatus={this.updateChatStatus} socketId={this.state.socketId}/>
        <Canvas updateSocketId={this.updateSocketId} isChatHidden={this.state.isChatHidden}/>
      </div>
    )
  }
}
