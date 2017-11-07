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
      <SidebarContainer className={this.props.isUserListHidden ? 'hidden' : ''}>
        <UsersContainer>
          <UsersTopBar>
            <CurrentlyOnline>Contributors Online
              <HideUserList onClick={this.toggleUserList}>X</HideUserList>
            </CurrentlyOnline>
          </UsersTopBar>
          <Users>
            <ArtistsOnline>
              {'Artists (' + this.props.onlineUsers.filter(user => !user.nickname.startsWith('GUEST')).length + ')'}
            </ArtistsOnline>
            {this.props.onlineUsers.filter(user => !user.nickname.startsWith('GUEST'))
              .map((user, index) => {
                return <OnlineUser key={index}>{user.nickname}</OnlineUser>
              })
            }
            <ArtistsOnline>{'Guests (' + this.props.onlineUsers.filter(user => user.nickname.startsWith('GUEST')).length + ')'}</ArtistsOnline>
            {this.props.onlineUsers.filter(user => user.nickname.startsWith('GUEST'))
              .map((user, index) => {
                return <OnlineUser key={index}>{user.nickname}</OnlineUser>
              })
            }
          </Users>
        </UsersContainer>
      </SidebarContainer>
    )
  }
}

const SidebarContainer = styled.div`
  position: absolute;
  width: 34%;
  height: 100%;
  max-width: 500px;
  background-color: whitesmoke;
  border-right: 1px solid grey;
  color: #312c32;
`

const UsersContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 5;
  text-align: left;
`

const UsersTopBar = styled.div`
  position: absolute;
  height: 75px;
  width: 100%;
  border-bottom: 1px solid grey;
  padding: 0 20px;
`

const CurrentlyOnline = styled.span`
  position: relative;
  top: 20px;
  font-size: 1.75em;
  font-family: 'Bubblegum Sans', cursive;
`

const HideUserList = styled.button`
  position: relative;
  top: 20px;
  float: right;
  border-radius: 5px;
  width: 30px;
  height: 30px;
`

const Users = styled.div`
  top: 75px;
  position: relative;
  height: 85%;
  width: 90%;
  padding: 0 20px;
`

const ArtistsOnline = styled.div`
  font-size: 1.25em;
  margin: 20px 0;
  font-family: 'Bubblegum Sans', cursive;
`

const OnlineUser = styled.div`
  margin: 10px;
`

function mapStateToProps(state) {
  return {
    isUserListHidden: state.chat.isUserListHidden,
    onlineUsers: state.chat.onlineUsers
  }
}

const Connected = connect(mapStateToProps)(UserList)
export default Connected
