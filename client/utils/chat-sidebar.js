import React from 'react'
import styled from 'styled-components'

export default class ChatSidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      messageList: []
    }
  }
  render() {
    return (
      <SidebarContainer id="chat-sidebar-container" className="sidebar">
        <div id="chat-log"></div>
        <div id="chat-id-container" className="sidebar chat-id-module">Connected as:
          <IdInput id="chat-id-field" type="text"/>
        </div>
        <ChatBox id="chat-box" className="sidebar text-centered">
          <ChatField name="chat-field" id="chat-field" cols="27" rows="4"></ChatField>
          <button id="send-button" className="chat-button float-right">Chat</button>
          <button id="hide-button" className="chat-button float-left">Hide</button>
        </ChatBox>
      </SidebarContainer>
    )
  }
}

const SidebarContainer = styled.div`
  height: 100%;
  background-color: lightgrey;
`

const IdInput = styled.input`
  height: 25px;
  width: 150px;
  padding: 0 5px;
  margin: 5px 10px;
  font-size: 1em;
`

const ChatBox = styled.div`
  padding: 20px;
  height: 175px;
  background-color: powderblue;
  bottom: 0;
`

const ChatField = styled.textarea`
  padding: 10px;
  resize: none;
  font-size: 1em;
`
