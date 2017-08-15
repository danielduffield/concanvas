import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

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
        <UnhideUsers className={this.props.isUserListHidden ? 'chat-button' : 'chat-button hidden'}
          onClick={this.toggleUserList}>Display Users</UnhideUsers>
        <UsersContainer className={this.props.isUserListHidden ? 'hidden' : ''}>
          <UsersTopBar>
            <HideUsers id="chat-hide" className="float-left"
              onClick={this.toggleUserList}>Hide Users</HideUsers>
            <UserCount>Online: </UserCount>
          </UsersTopBar>
          <Users></Users>
        </UsersContainer>
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
  margin: 0;
`

const HideUsers = styled.button`
  height: 100%;
  width: 25%;
  margin-left: 5%;
  border-radius: 5px;
  min-width: 90px;
  font-size: 1em;
`

const UserCount = styled.div`
  float: left;
  height: 100%;
  line-height: 200%;
  margin-left: 5%;
  background-color: grey;
`

const UsersContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 40%;
  background-color: grey;
  z-index: 5;
`

const UsersTopBar = styled.div`
  position: absolute;
  height: 7%;
  width: 100%;
  background-color: grey;
`

const Users = styled.div`
  background-color: lightgrey;
  height: 90%;
  width: 90%;
  margin: 5%;
  overflow-y: scroll;
`

function mapStateToProps(state) {
  return {
    isUserListHidden: state.chat.isUserListHidden
  }
}

const Connected = connect(mapStateToProps)(UserList)
export default Connected
