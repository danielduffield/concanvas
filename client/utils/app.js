import React from 'react'

import Canvas from './canvas'
import ChatSidebar from './chat-sidebar'

export default function App() {
  return (
    <div>
      <div id="title-container">
        <h1 id="main-title">ConCanvas</h1>
      </div>
      <ChatSidebar />
      <Canvas />
    </div>
  )
}
