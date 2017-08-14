import React from 'react'
import styled from 'styled-components'

import io from 'socket.io-client'
const socket = io.connect()

export default class ChatSidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isHidden: false,
      chatMessages: [],
      id: getNicknameFromCookies()
    }
    this.hideChat = this.hideChat.bind(this)
    this.revealChat = this.revealChat.bind(this)
    this.submitMessage = this.submitMessage.bind(this)
    this.enterSubmit = this.enterSubmit.bind(this)
    this.updateChatFeed = this.updateChatFeed.bind(this)

    this.messageForm = null
  }
  submitMessage(event) {
    event.preventDefault()
    const messageFormData = new FormData(this.messageForm)
    const message = {
      nickname: messageFormData.get('id-field'),
      content: messageFormData.get('chat-field'),
      locallySubmitted: true
    }
    if (message.content === '') return
    this.setState(
      {
        isHidden: this.state.isHidden,
        chatMessages: this.state.chatMessages.length < 23
          ? [...this.state.chatMessages, message]
          : [...this.state.chatMessages.slice(1, this.state.chatMessages.length), message],
        id: message.nickname
      })
    socket.emit('chat', message)
  }
  updateChatFeed(message) {
    this.setState({ isHidden: this.state.isHidden, chatMessages: [...this.state.chatMessages, message], id: this.state.id })
  }
  hideChat() {
    this.setState({ isHidden: true, chatMessages: this.state.chatMessages })
    this.props.updateChatStatus(true)
  }
  revealChat() {
    this.setState({ isHidden: false, chatMessages: this.state.chatMessages })
    this.props.updateChatStatus(false)
  }
  enterSubmit(event) {
    if (event.key === 'Enter') {
      this.submitMessage(event)
    }
  }
  sendCookie(event) {
    if (event.target.value === 'GUEST') return
    const date = new Date()
    const daysTilExpiration = 3
    const expiration = date.setTime(date.getTime() + (daysTilExpiration * 24 * 60 * 60 * 1000))
    document.cookie = 'concanvas_nickname=' + event.target.value + '; expires=' + expiration
  }
  componentDidMount() {
    socket.on('chat', this.updateChatFeed)
  }
  render() {
    const ChatWindow = styled.div`
      height: 100%;
      background-color: ${this.state.isHidden ? 'whitesmoke' : 'grey'};
      border-right: ${this.state.isHidden ? 'none' : '2px solid dimgrey'};
    `
    return (
      <ChatColumn id="chat-column">
        <SidebarContainer id="sidebar-container">
          <ChatFeed id="chat-feed" className={this.state.isHidden ? 'hidden' : ''}>
            <MessageList>
              <ChatBlob id="chat-blob">
                {this.state.chatMessages.map((message, index) => {
                  const StyledNickname = styled.span`
                    color: ${message.locallySubmitted ? 'red' : 'blue'};
                  `

                  return (
                    <div className="chat-message" key={index}>
                      <StyledNickname>{message.nickname}</StyledNickname>{': ' + message.content}
                    </div>
                  )
                })}
              </ChatBlob>
            </MessageList>
          </ChatFeed>
          <form id="message-form" onSubmit={this.submitMessage}
            ref={form => {
              this.messageForm = form
            }}>
            <ChatWindow>
              <ChatIdModule id="chat-id-box"
                className={this.state.isHidden ? 'hidden' : ''}>
                Nickname:
                <IdInput id="chat-id-field" name="id-field" type="text"
                  defaultValue={
                    this.state.id
                    ? this.state.id
                    : 'GUEST'}
                  onBlur={this.sendCookie}/>
              </ChatIdModule>
              <ChatBox id="chat-box"
                className={this.state.isHidden ? 'hidden' : ''}>
                <ChatField name="chat-field" id="chat-field" cols="27" rows="4"
                  maxLength="250" autoFocus onKeyPress={this.enterSubmit}></ChatField>
                <button id="chat-send" className="chat-button float-right"
                  onClick={this.submitMessage} type="submit">Chat</button>
                <button id="chat-hide" className="chat-button float-left"
                  onClick={this.hideChat}>Hide</button>
              </ChatBox>
            </ChatWindow>
          </form>
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
`

const ChatIdModule = styled.div`
  margin-left: 6%;
  text-align: left;
  position: relative;
  top: 8px;
  height: 20%;
  background-color: grey;
`

const SidebarContainer = styled.div`
  position: absolute;
  width: 34%;
  height: 100%;
  max-width: 500px;
  background-color: whitesmoke;
`

const IdInput = styled.input`
  width: 55%;
  margin: 0 0 0 10px;
  font-size: 1em;
  line-height: 20px;
`

const ChatBox = styled.div`
  text-align: center;
  height: 75%;
  background-color: grey;
`

const ChatFeed = styled.div`
  height: 75%;
  bottom: 0;
  background-color: whitesmoke;
  border-bottom: 2px solid dimgrey;
`

const MessageList = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`

const ChatBlob = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
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
  margin: 0;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200px;
  height: 50px;
  z-index: 10;
`

function getNicknameFromCookies() {
  const cookieList = document.cookie
  const cookies = cookieList.split('; ').map(cookiePair => cookiePair.split('='))
  const index = cookies.findIndex(cookie => {
    return cookie[0] === 'concanvas_nickname'
  })
  return index !== -1 ? cookies[index][1] : null
}
