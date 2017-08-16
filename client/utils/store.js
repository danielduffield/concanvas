import { createStore, combineReducers } from 'redux'

const reducer = combineReducers({
  paint: paintReducer,
  chat: chatReducer
})

function paintReducer(state = {
  color: '#000000',
  size: 2,
  isErasing: false
}, action) {
  switch (action.type) {
    case 'SELECTED_COLOR':
      return Object.assign({}, state, { color: action.payload.text, isErasing: false })
    case 'SELECTED_SIZE':
      return Object.assign({}, state, { size: action.payload.text })
    case 'TOGGLED_ERASER':
      return Object.assign({}, state, { isErasing: !state.isErasing, color: !state.isErasing ? '#FFFFFF' : state.color })
    default:
      return state
  }
}

function chatReducer(state = {
  isUserListHidden: true,
  isChatHidden: true,
  chatFeed: [],
  nickname: null,
  messageContent: '',
  socketId: null,
  onlineUsers: []
}, action) {
  switch (action.type) {
    case 'SOCKET_ESTABLISHED':
      return Object.assign({}, state, { socketId: action.payload.text })
    case 'TOGGLED_CHAT':
      return Object.assign({}, state, { isChatHidden: !state.isChatHidden })
    case 'MESSAGE_UPDATED':
      return Object.assign({}, state, { messageContent: action.payload.text })
    case 'MESSAGE_SENT':
      return state.chatFeed.length < 23
          ? Object.assign({}, state, { chatFeed: state.chatFeed.concat(action.payload.message), messageContent: '' })
          : Object.assign({}, state, {
            chatFeed: [...state.chatFeed.slice(1, state.chatFeed.length), action.payload.message],
            messageContent: '' })
    case 'NICKNAME_SAVED':
      return Object.assign({}, state, { nickname: action.payload.text })
    case 'TOGGLED_USER_LIST':
      return Object.assign({}, state, { isUserListHidden: !state.isUserListHidden })
    case 'UPDATED_USER_LIST':
      return Object.assign({}, state, { onlineUsers: action.payload.users })
    default:
      return state
  }
}

export default createStore(reducer)

// Canvas
  // Socket Id
  // Chat status
  // color

// Paint
  // color            SELECTED_COLOR
  // Eraser           TOGGLED_ERASER

// Chat
  // isChatHidden     TOGGLED_CHAT
  // chatMessages     MESSAGE_RECEIVED
  // nickname         NICKNAME_SAVED
  // socketId         SOCKET_ESTABLISHED
  // messageContent   MESSAGE_UPDATED