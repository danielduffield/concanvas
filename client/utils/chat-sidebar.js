import React from 'react'
import styled from 'styled-components'

export default class ChatSidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isHidden: false,
      messageList: []
    }
    this.hideChat = this.hideChat.bind(this)
    this.revealChat = this.revealChat.bind(this)
  }
  hideChat() {
    this.setState({ isHidden: true, messageList: this.state.messageList })
  }
  revealChat() {
    this.setState({ isHidden: false, messageList: this.state.messageList })
  }
  render() {
    return (
      <ChatColumn id="chat-column">
        <SidebarContainer id="sidebar-container"
          className={this.state.isHidden ? 'sidebar hidden' : 'sidebar'}>
          <ChatFeed id="chat-feed"></ChatFeed>
          <ChatIdModule id="chat-id-box" className="sidebar">Nickname:
            <IdInput id="chat-id-field" type="text"/>
          </ChatIdModule>
          <ChatBox id="chat-box" className="sidebar text-centered">
            <ChatField name="chat-field" id="chat-field" cols="27" rows="4"></ChatField>
            <button id="chat-send" className="chat-button float-right">Chat</button>
            <button id="chat-hide" className="chat-button float-left"
              onClick={this.hideChat}>Hide</button>
          </ChatBox>
        </SidebarContainer>
        <UnhideButton id="unhide-button"
          className={this.state.isHidden ? 'chat-button' : 'chat-button hidden'}
          onClick={this.revealChat}>Display Chat</UnhideButton>
      </ChatColumn>
    )
  }
}

const ChatColumn = styled.div`
  float: left;
  width: 34%;
`

const ChatIdModule = styled.div`
  margin-left: 6%;
  text-align: left;
  position: relative;
  top: 8px;
  height: 4%;
  background-color: grey;
`

const SidebarContainer = styled.div`
  position: absolute;
  width: 34%;
  height: 100%;
  background-color: grey;
`

const IdInput = styled.input`
  width: 55%;
  margin: 0 0 0 10px;
  font-size: 1em;
  line-height: 20px;
`

const ChatBox = styled.div`
  text-align: center;
  height: 20%;
  background-color: grey;
`

const ChatFeed = styled.div`
  height: 75%;
  bottom: 0;
  background-color: gainsboro;
`

const ChatField = styled.textarea`
  padding: 5px;
  font-size: 1em;
  margin: 2% 0 0;
  width: 90%;
  height: 60%;
  resize: none;
`

const UnhideButton = styled.button`

`
