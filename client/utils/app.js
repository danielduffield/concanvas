import React from 'react'
import styled from 'styled-components'

import Canvas from './canvas'
import ChatSidebar from './chat-sidebar'
import UserList from './user-list.js'

export default function App() {
  return (
    <MainContainer>
      <ChatSidebar />
      <UserList />
      <Canvas />
    </MainContainer>
  )
}

const MainContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`
