import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import store from './store'

class UserList extends React.Component {
  constructor(props) {
    super(props)

    this.toggleUserList = this.toggleUserList.bind(this)
  }
  toggleUserList() {
    this.props.dispatch({
      type: 'TOGGLED_USER_LIST'
    })
  }
  render() {
    return (
      <div>
        <UnhideUsers className="chat-button"
          onClick={this.toggleUserList}>Display Users</UnhideUsers>
        <UsersContainer className={this.props.isUserListHidden ? 'hidden' : ''}></UsersContainer>
      </div>
    )
  }
}

const UnhideUsers = styled.button`
  margin: 0;
  left: 0;
  position: absolute;
  width: 200px;
  height: 50px;
  z-index: 10;
`

const UsersContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 40%;
  background-color: grey;
  z-index: 5;
`

function mapStateToProps(state) {
  return {
    isUserListHidden: state.chat.isUserListHidden
  }
}

const Connected = connect(mapStateToProps)(UserList)
export default Connected
