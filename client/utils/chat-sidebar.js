import React from 'react'
import styled from 'styled-components'

import io from 'socket.io-client'
const socket = io.connect()

export default class ChatSidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isHidden: true,
      chatMessages: [],
      nickname: getNicknameFromCookies(),
      messageContent: '',
      socketId: null
    }
    this.hideChat = this.hideChat.bind(this)
    this.revealChat = this.revealChat.bind(this)
    this.submitMessage = this.submitMessage.bind(this)
    this.enterSubmit = this.enterSubmit.bind(this)
    this.updateChatFeed = this.updateChatFeed.bind(this)
    this.sendCookie = this.sendCookie.bind(this)
    this.updateNickname = this.updateNickname.bind(this)
    this.updateMessageContent = this.updateMessageContent.bind(this)

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
        chatMessages: this.state.chatMessages.length < 23
          ? [...this.state.chatMessages, message]
          : [...this.state.chatMessages.slice(1, this.state.chatMessages.length), message],
        messageContent: ''
      })
    socket.emit('chat', message)
  }
  updateChatFeed(message) {
    this.setState({ chatMessages: [...this.state.chatMessages, message] })
  }
  hideChat() {
    this.setState({ isHidden: true })
    this.props.updateChatStatus(true)
  }
  revealChat() {
    this.setState({ isHidden: false })
    this.props.updateChatStatus(false)
  }
  enterSubmit(event) {
    if (event.key === 'Enter') {
      this.submitMessage(event)
    }
  }
  sendCookie(event) {
    if (event.target.value.includes('GUEST') && event.target.value.includes(this.state.socketId.substr(0, 4))) {
      return false
    }
    console.log('COOKIE SENT')
    const date = new Date()
    const daysTilExpiration = 3
    const expiration = date.setTime(date.getTime() + (daysTilExpiration * 24 * 60 * 60 * 1000))
    document.cookie = 'concanvas_nickname=' + event.target.value + '; expires=' + expiration
  }
  updateNickname(event) {
    console.log(event.target.value)
    this.setState({
      nickname: event.target.value
    })
  }
  updateMessageContent(event) {
    this.setState({ messageContent: event.target.value })
  }
  componentDidMount() {
    socket.on('chat', this.updateChatFeed)
    socket.on('connectionId', id => {
      this.setState({ socketId: id })
    })
  }
  render() {
    return (
      <ChatColumn id="chat-column">
        <SidebarContainer id="sidebar-container">
          <ChatFeed id="chat-feed" className={this.state.isHidden ? 'hidden' : ''}>
            <MessageList>
              <ChatBlob id="chat-blob">
                {this.state.chatMessages.map((message, index) => {
                  return (
                    <div className="chat-message" key={index}>
                      <StyledNickname locallySubmitted={message.locallySubmitted}>{message.nickname}</StyledNickname>{': ' + message.content}
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
            <ChatWindow isHidden={this.state.isHidden}>
              <ChatIdModule id="chat-id-box"
                className={this.state.isHidden ? 'hidden' : ''}>
                Nickname:
                <IdInput id="chat-id-field" name="id-field" type="text"
                  value={this.state.nickname
                    ? this.state.nickname
                    : 'GUEST (' + (this.state.socketId ? this.state.socketId.substr(0, 4) : '') + ')'}
                  onChange={this.updateNickname}
                  onBlur={this.sendCookie}/>
              </ChatIdModule>
              <ChatBox id="chat-box"
                className={this.state.isHidden ? 'hidden' : ''}>
                <ChatField name="chat-field" id="chat-field" cols="27" rows="4"
                  maxLength="250" onKeyPress={this.enterSubmit}
                  value={this.state.messageContent} onChange={this.updateMessageContent}></ChatField>
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

const StyledNickname = styled.span`
  color: ${props => props.locallySubmitted ? 'red' : 'blue'};
`

const ChatWindow = styled.div`
  height: 100%;
  border-radius: 10px;
  border: ${props => props.isHidden ? 'none' : '2px solid steelblue'};
  background-color: ${props => props.isHidden ? 'whitesmoke' : 'lightblue'};
`

const ChatColumn = styled.div`
  float: left;
`

const ChatIdModule = styled.div`
  margin-left: 6%;
  text-align: left;
  position: relative;
  top: 8px;
  height: 15%;
  background-color: lightblue;
  font-family: 'Bubblegum Sans', cursive;
  font-size: 1.25em;
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
  font-size: 0.85em;
  line-height: 2%;`

const ChatBox = styled.div`
  text-align: center;
  height: 75%;
  background-color: lightblue;
`

const ChatFeed = styled.div`
  height: 80%;
  bottom: 0;
  background-color: whitesmoke;
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
  height: 70%;
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
