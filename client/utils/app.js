import React from 'react'

import Canvas from './canvas'
import ChatSidebar from './chat-sidebar'
import UserList from './user-list.js'

export default function App() {
  return (
    <div>
      <ChatSidebar />
      <UserList />
      <Canvas />
    </div>
  )
}
