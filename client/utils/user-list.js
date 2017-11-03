import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import socket from './socket-connection'

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
  componentDidMount() {
    socket.on('userlist', users => {
      this.props.dispatch({
        type: 'UPDATED_USER_LIST',
        payload: { users }
      })
    })
  }
  render() {
    return (
      <div>
        <UnhideUsers className={this.props.isUserListHidden ? 'chat-button' : 'chat-button hidden'}
          onClick={this.toggleUserList}>Display Users</UnhideUsers>
        <UsersContainer className={this.props.isUserListHidden ? 'hidden' : ''}>
          <UsersTopBar>
            <HideUsers id="chat-hide" className="float-left"
              onClick={this.toggleUserList}>Hide Users</HideUsers>
            <UserCount>Online: {this.props.onlineUsers.length}</UserCount>
          </UsersTopBar>
          <Users>
            {this.props.onlineUsers.map((user, index) => {
              return <OnlineUser key={index}>{user.nickname}</OnlineUser>
            })}
          </Users>
        </UsersContainer>
      </div>
    )
  }
}

const OnlineUser = styled.div`
  margin: 5px;
`

const UnhideUsers = styled.button`
  margin: 0;
  left: 0;
  position: absolute;
  width: 200px;
  height: 50px;
  z-index: 10;
  margin: 0;
`

const HideUsers = styled.button`
  height: 100%;
  width: 25%;
  margin-left: 5%;
  border-radius: 5px;
  min-width: 90px;
  font-size: 1em;
  min-height: 35px;
`

const UserCount = styled.div`
  line-height: 200%;
  float: right;
  height: 100%;
  margin-right: 5%;
  font-family: 'Bubblegum Sans', cursive;
  font-size: 1.25em;
`

const UsersContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 40%;
  z-index: 5;
`

const UsersTopBar = styled.div`
  position: absolute;
  height: 5%;
  width: 100%;
`

const Users = styled.div`
  height: 85%;
  width: 90%;
  margin: 8% 5% 5%;
  border-radius: 10px;
`

function mapStateToProps(state) {
  return {
    isUserListHidden: state.chat.isUserListHidden,
    onlineUsers: state.chat.onlineUsers
  }
}

const Connected = connect(mapStateToProps)(UserList)
export default Connected
