import React from 'react'

import Canvas from './canvas'
import ChatSidebar from './chat-sidebar'
import DownloadModule from './download-module'

export default function App() {
  return (
    <div>
      <ChatSidebar />
      <Canvas />
      <DownloadModule />
    </div>
  )
}
