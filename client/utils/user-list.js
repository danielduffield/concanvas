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
      <SidebarContainer>
        <UsersContainer className={this.props.isUserListHidden ? 'hidden' : ''}>
          <UsersTopBar>
            <CurrentlyOnline>Currently Online</CurrentlyOnline>
          </UsersTopBar>
          <Users>
            <ArtistsOnline>{'Artists (' +  + this.props.onlineUsers.length + ')'}</ArtistsOnline>
            {this.props.onlineUsers.map((user, index) => {
              return <OnlineUser key={index}>{user.nickname}</OnlineUser>
            })}
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
  border-right: 2px solid dimgrey;
`

const CurrentlyOnline = styled.span`
  position: relative;
  top: 20px;
  font-size: 1.5em;
`

const ArtistsOnline = styled.div`
  font-size: 1.25em;
  margin: 20px 0;
`

const OnlineUser = styled.div`
  margin: 10px;
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
  height: 100%;
  z-index: 5;
  text-align: left;
`

const UsersTopBar = styled.div`
  position: absolute;
  height: 75px;
  width: 100%;
  border-bottom: 2px solid dimgrey;
  padding: 0 20px;
`

const Users = styled.div`
  top: 75px;
  position: relative;
  height: 85%;
  width: 90%;
  padding: 0 20px;
`

function mapStateToProps(state) {
  return {
    isUserListHidden: state.chat.isUserListHidden,
    onlineUsers: state.chat.onlineUsers
  }
}

const Connected = connect(mapStateToProps)(UserList)
export default Connected
