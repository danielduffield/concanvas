import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import UserList from './user-list'

import socket from './socket-connection'

class ChatSidebar extends React.Component {
  constructor(props) {
    super(props)

    this.submitMessage = this.submitMessage.bind(this)
    this.enterSubmit = this.enterSubmit.bind(this)
    this.updateChatFeed = this.updateChatFeed.bind(this)
    this.sendCookie = this.sendCookie.bind(this)
    this.updateNickname = this.updateNickname.bind(this)
    this.updateMessageContent = this.updateMessageContent.bind(this)
    this.toggleChat = this.toggleChat.bind(this)
    this.handleChatEvent = this.handleChatEvent.bind(this)

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
    this.props.dispatch({
      type: 'MESSAGE_SENT',
      payload: { message: message }
    })
    socket.emit('chat', message)
  }
  updateChatFeed(message) {
    this.props.dispatch({
      type: 'MESSAGE_SENT',
      payload: { message: message }
    })
  }
  toggleChat() {
    this.props.dispatch({ type: 'TOGGLED_CHAT' })
  }
  enterSubmit(event) {
    if (event.key === 'Enter') {
      this.submitMessage(event)
    }
  }
  sendCookie(event) {
    if (event.target.value.includes('GUEST') && event.target.value.includes(this.props.socketId.substr(0, 4))) {
      return false
    }
    const date = new Date()
    const daysTilExpiration = 3
    const expiration = date.setTime(date.getTime() + (daysTilExpiration * 24 * 60 * 60 * 1000))
    document.cookie = 'concanvas_nickname=' + event.target.value + '; expires=' + expiration
  }
  updateNickname(event) {
    this.props.dispatch({
      type: 'NICKNAME_SAVED',
      payload: { text: event.target.value }
    })
    socket.emit('nickname', event.target.value)
  }
  updateMessageContent(event) {
    this.props.dispatch({
      type: 'MESSAGE_UPDATED',
      payload: { text: event.target.value }
    })
  }
  handleChatEvent(chatEvent) {
    const eventMessage = {
      nickname: '',
      content: 'User [' + chatEvent.user.nickname + '] has ' + chatEvent.type + '.',
      locallySubmitted: false
    }
    this.updateChatFeed(eventMessage)
  }
  componentDidMount() {
    socket.on('chat', this.updateChatFeed)

    const nickname = getNicknameFromCookies()
    if (nickname) {
      this.props.dispatch({
        type: 'NICKNAME_SAVED',
        payload: { text: nickname }
      })
      socket.emit('nickname', nickname)
    }
    else {
      socket.emit('nickname', 'GUEST')
    }

    socket.on('chatEvent', this.handleChatEvent)
  }
  render() {
    return (
      <ChatColumn id="chat-column">
        <SidebarContainer id="sidebar-container">
          <UserList />
          <ChatFeed id="chat-feed" className={this.props.isChatHidden ? 'hidden' : ''}>
            <MessageList>
              <ChatBlob id="chat-blob">
                {this.props.chatFeed.map((message, index) => {
                  return (
                    <div className="chat-message" key={index}>
                      <StyledNickname locallySubmitted={message.locallySubmitted}>
                        {message.nickname}
                      </StyledNickname>{(message.nickname ? ': ' : '') + message.content}
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
            <ChatWindow isHidden={this.props.isChatHidden}>
              <ChatIdModule id="chat-id-box"
                className={this.props.isChatHidden ? 'hidden' : ''}>
                Nickname:
                <IdInput id="chat-id-field" name="id-field" type="text"
                  value={this.props.nickname
                    ? this.props.nickname
                    : 'GUEST (' + (this.props.socketId ? this.props.socketId.substr(0, 4) : '') + ')'}
                  onChange={this.updateNickname}
                  onBlur={this.sendCookie}/>
              </ChatIdModule>
              <ChatBox id="chat-box"
                className={this.props.isChatHidden ? 'hidden' : ''}>
                <ChatField name="chat-field" id="chat-field" cols="27" rows="4"
                  maxLength="250" onKeyPress={this.enterSubmit}
                  value={this.props.messageContent} onChange={this.updateMessageContent}></ChatField>
                <button id="chat-send" className="chat-button float-right"
                  onClick={this.submitMessage} type="submit">Chat</button>
                <button id="chat-hide" className="chat-button float-left"
                  onClick={this.toggleChat}>Hide</button>
              </ChatBox>
            </ChatWindow>
          </form>
        </SidebarContainer>
        <UnhideButton id="unhide-button"
          className={this.props.isChatHidden ? 'chat-button' : 'chat-button hidden'}
          onClick={this.toggleChat}>Display Chat</UnhideButton>
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

function mapStateToProps(state) {
  return {
    isChatHidden: state.chat.isChatHidden,
    chatFeed: state.chat.chatFeed,
    messageContent: state.chat.messageContent,
    socketId: state.chat.socketId,
    nickname: state.chat.nickname
  }
}

const Connected = connect(mapStateToProps)(ChatSidebar)
export default Connected
