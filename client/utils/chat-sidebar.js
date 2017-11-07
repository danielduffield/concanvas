import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

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
    this.toggleUsers = this.toggleUsers.bind(this)
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
  toggleUsers() {
    this.props.dispatch({ type: 'TOGGLED_USER_LIST' })
  }
  enterSubmit(event) {
    if (event.key === 'Enter') {
      this.submitMessage(event)
    }
  }
  sendCookie(event) {
    if (event.target.value === '') event.target.value = 'GUEST (' + (this.props.socketId ? this.props.socketId.substr(0, 4) : '') + ')'
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
      <ChatColumn id="chat-column" className={this.props.isChatHidden ? 'hidden' : ''}>
        <SidebarContainer id="sidebar-container">
          <ChatHeading>
            <ChatWelcome>Welcome to the chat!</ChatWelcome>
            <HideChat onClick={this.toggleChat}>X</HideChat>
          </ChatHeading>
          <ChatFeed id="chat-feed">
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
          <ChatFormContainer>
            <form id="message-form" onSubmit={this.submitMessage}
              ref={form => {
                this.messageForm = form
              }}>
              <ChatIdModule id="chat-id-box"
                className={this.props.isChatHidden ? 'hidden' : ''}>
                Nickname:
                <IdInput id="chat-id-field" name="id-field" type="text"
                  value={this.props.nickname !== null
                    ? this.props.nickname
                    : 'GUEST (' + (this.props.socketId ? this.props.socketId.substr(0, 4) : '') + ')'}
                  onChange={this.updateNickname}
                  onBlur={this.sendCookie}/>
              </ChatIdModule>
              <ChatField name="chat-field" id="chat-field" cols="27" rows="4"
                maxLength="250" onKeyPress={this.enterSubmit}
                value={this.props.messageContent} onChange={this.updateMessageContent}></ChatField>
              <ChatButton id="chat-send-btn" className="float-right"
                onClick={this.submitMessage} type="submit">Chat</ChatButton>
              <ChatButton id="chat-users-btn" className="float-left"
                onClick={this.toggleUsers}>
                <i className="fa fa-list-ul" aria-hidden="true"></i>
              </ChatButton>
            </form>
          </ChatFormContainer>
        </SidebarContainer>
      </ChatColumn>
    )
  }
}

const ChatColumn = styled.div`
  float: left;
`

const SidebarContainer = styled.div`
  position: absolute;
  width: 34%;
  height: 100%;
  max-width: 500px;
  background-color: whitesmoke;
  border-right: 1px solid grey;
`

const ChatHeading = styled.div`
  height: 10%;
  width: 100%;
  padding: 20px;
`

const ChatWelcome = styled.span`
  font-family: 'Bubblegum Sans', cursive;
  font-size: 1.75em;
`

const HideChat = styled.button`
  position: relative;
  float: right;
  border-radius: 5px;
  width: 30px;
  height: 30px;
`

const ChatFeed = styled.div`
  height: 60%;
  bottom: 0;
  background-color: whitesmoke;
`

const MessageList = styled.div`
  position: relative;
  height: 100%;
  width: 90%;
  margin-left: 5%;
`

const ChatBlob = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
`

const StyledNickname = styled.span`
  color: ${props => props.locallySubmitted ? 'red' : 'blue'};
`

const ChatFormContainer = styled.div`
  height: 30%;
  width: 100%;
  position: absolute;
`

const ChatIdModule = styled.div`
  margin: 5px 0;
  margin-left: 5%;
  text-align: left;
  position: relative;
  top: 8px;
  font-family: 'Bubblegum Sans', cursive;
  font-size: 1.25em;
`

const IdInput = styled.input`
  width: 55%;
  margin: 0 0 0 10px;
  font-size: 0.85em;
`

const ChatField = styled.textarea`
  padding: 5px;
  font-size: 1em;
  margin: 2% 0 0;
  width: 90%;
  height: 80%;
  resize: none;
`

const ChatButton = styled.button`
  border-radius: 5px;
  margin: 2% 5% 0;
  height: 20%;
  width: 15%;
  min-width: 42px;
  font-size: 1em;
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
