import React from 'react'

import Canvas from './canvas'
import ChatSidebar from './chat-sidebar'

import styled from 'styled-components'

export default function App() {
  return (
    <div>
      <MainTitle id="main-title">ConCanvas</MainTitle>
      <ChatSidebar />
      <Canvas />
    </div>
  )
}

const MainTitle = styled.h1`
  width: 300px;
  top: 10px;
  font-size: 4em;
  font-family: 'Bubblegum Sans', cursive;
  left: 0;
  right: 0;
  position: absolute;
  margin: 0 auto;
  background-color: whitesmoke;
  z-index: 10;
`
