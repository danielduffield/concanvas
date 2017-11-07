import { createStore, combineReducers } from 'redux'

const reducer = combineReducers({
  paint: paintReducer,
  chat: chatReducer,
  utility: utilityReducer
})

function paintReducer(state = {
  color: '#000000',
  size: 2,
  isErasing: false,
  isColorPickerHidden: true,
  customColors: ['whitesmoke', 'whitesmoke', 'whitesmoke', 'whitesmoke', 'whitesmoke', 'whitesmoke'],
  customSelected: null,
  currentColor: '#000000'
}, action) {
  switch (action.type) {
    case 'LOADED_CUSTOM_COLORS':
      return Object.assign({}, state, { customColors: action.payload.colors })
    case 'SELECTED_COLOR':
      return Object.assign({}, state, { isColorPickerHidden: true, customSelected: null, color: action.payload.text, currentColor: action.payload.text, isErasing: false })
    case 'SELECTED_CUSTOM_SLOT':
      return Object.assign({}, state, {
        isColorPickerHidden: false,
        customSelected: action.payload.index,
        isErasing: false,
        color: state.customColors[action.payload.index],
        currentColor: state.customColors[action.payload.index] })
    case 'SELECTED_CUSTOM_COLOR':
      return Object.assign({}, state, {
        color: action.payload.color,
        currentColor: action.payload.color,
        customColors: [
          ...state.customColors.slice(0, action.payload.index),
          action.payload.color,
          ...state.customColors.slice(action.payload.index + 1, state.customColors.length)
        ]
      })
    case 'UPDATED_CURRENT_COLOR':
      return Object.assign({}, state, { currentColor: action.payload.text })
    case 'TOGGLED_COLOR_PICKER':
      return Object.assign({}, state, { isColorPickerHidden: !state.isColorPickerHidden, customSelected: null, isErasing: false, color: action.payload.color })
    case 'SELECTED_SIZE':
      return Object.assign({}, state, { isColorPickerHidden: true, size: action.payload.text })
    case 'TOGGLED_ERASER':
      return Object.assign({}, state, { isColorPickerHidden: true, isErasing: !state.isErasing, color: '#FFFFFF' })
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
      return Object.assign({}, state, {
        isChatHidden: (state.isUserListHidden ? !state.isChatHidden : true),
        isUserListHidden: true
      })
    case 'MESSAGE_UPDATED':
      return Object.assign({}, state, { messageContent: action.payload.text })
    case 'MESSAGE_SENT':
      return state.chatFeed.length < 23
          ? Object.assign({}, state, {
            chatFeed: state.chatFeed.concat(action.payload.message),
            messageContent: action.payload.message.locallySubmitted ? '' : state.messageContent
          })
          : Object.assign({}, state, {
            chatFeed: [...state.chatFeed.slice(1, state.chatFeed.length), action.payload.message],
            messageContent: action.payload.message.locallySubmitted ? '' : state.messageContent })
    case 'NICKNAME_SAVED':
      return Object.assign({}, state, { nickname: action.payload.text })
    case 'TOGGLED_USER_LIST':
      return Object.assign({}, state, { isUserListHidden: !state.isUserListHidden, isChatHidden: !state.isChatHidden })
    case 'UPDATED_USER_LIST':
      return Object.assign({}, state, { onlineUsers: action.payload.users })
    default:
      return state
  }
}

function utilityReducer(state = {
  isDownloadLinkActive: false,
  isToolbarHoriz: true
}, action) {
  switch (action.type) {
    case 'TOGGLED_DOWNLOAD_LINK':
      return Object.assign({}, state, { isDownloadLinkActive: !state.isDownloadLinkActive })
    case 'DEACTIVATED_DOWNLOAD_LINK':
      return Object.assign({}, state, { isDownloadLinkActive: false })
    default:
      return state
  }
}

export default createStore(reducer)
