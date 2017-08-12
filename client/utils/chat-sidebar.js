import React from 'react'
import styled from 'styled-components'

export default class ChatSidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isHidden: false,
      chatMessages: []
    }
    this.hideChat = this.hideChat.bind(this)
    this.revealChat = this.revealChat.bind(this)
    this.submitMessage = this.submitMessage.bind(this)

    this.messageForm = null
  }
  submitMessage(event) {
    event.preventDefault()
    const messageFormData = new FormData(this.messageForm)
    const message = {
      nickname: messageFormData.get('id-field'),
      content: messageFormData.get('chat-field')
    }
    this.setState({ isHidden: this.state.isHidden, chatMessages: [...this.state.chatMessages, message] })
  }
  hideChat() {
    this.setState({ isHidden: true, chatMessages: this.state.chatMessages })
  }
  revealChat() {
    this.setState({ isHidden: false, chatMessages: this.state.chatMessages })
  }
  render() {
    console.log(this.state)
    const ChatWindow = styled.div`
      height: 100%;
      background-color: ${this.state.isHidden ? 'whitesmoke' : 'grey'};
      border-right: ${this.state.isHidden ? 'none' : '2px solid dimgrey'};
    `
    return (
      <ChatColumn id="chat-column">
        <SidebarContainer id="sidebar-container">
          <MainTitle id="main-title">ConCanvas</MainTitle>
          <ChatFeed id="chat-feed" className={this.state.isHidden ? 'hidden' : ''}>
            <MessageList>
              <ChatBlob id="chat-blob">
                {this.state.chatMessages.map((message, index) => {
                  return (
                    <div className="chat-message" key={index}>{message.nickname + ': ' + message.content}</div>
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
                <IdInput id="chat-id-field" name="id-field" type="text"/>
              </ChatIdModule>
              <ChatBox id="chat-box"
                className={this.state.isHidden ? 'hidden' : ''}>
                <ChatField name="chat-field" id="chat-field" cols="27" rows="4"></ChatField>
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

const MainTitle = styled.h1`
  top: 10px;
  font-size: 4em;
  font-family: 'Bubblegum Sans', cursive;
  left: 0;
  right: 0;
  position: absolute;
  background-color: whitesmoke;
`

const ChatColumn = styled.div`
  float: left;
  width: 34%;
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
  padding-top: 100px;
  height: 75%;
  bottom: 0;
  background-color: whitesmoke;
  border-bottom: 2px solid dimgrey;
`

const MessageList = styled.div`
  position: relative;
  height: 100%;
  border: 2px solid dimgrey;
  width: 100%;
  border-radius: 5px;
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
  width: 34%;
  height: 50px;
`
