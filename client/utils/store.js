import { createStore, combineReducers } from 'redux'

const reducer = combineReducers({
  paintReducer: paintReducer,
  chatReducer: chatReducer
})

function paintReducer(state = {
  color: '#000000',
  isErasing: false,
  socketId: null
}, action) {
  switch (action.type) {
    case 'SELECTED_COLOR':
      return Object.assign({}, state, { color: action.payload.color })
    case 'TOGGLED_ERASER':
      return Object.assign({}, state, { isErasing: !state.isErasing })
    default:
      return state
  }
}

function chatReducer(state = {
  isChatHidden: true,
  chatFeed: [],
  nickname: null,
  messageContent: ''
}, action) {
  switch (action.type) {
    case 'SOCKET_ESTABLISHED':
      return Object.assign({}, state, { socketId: action.payload.text })
    case 'TOGGLED_CHAT':
      return Object.assign({}, state, { isChatHidden: !state.isChatHidden })
    case 'MESSAGE_UPDATED':
      return Object.assign({}, state, { messageContent: state.messageContent.concat(action.payload.text) })
    case 'MESSAGE_SENT':
      return Object.assign({}, state, { chatFeed: state.chatFeed.concat(action.payload.text) })
    case 'NICKNAME_SAVED':
      return Object.assign({}, state, { nickname: action.payload.text })
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
