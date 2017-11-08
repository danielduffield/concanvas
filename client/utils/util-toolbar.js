import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import ChatOrientModule from './chat-orient-module'
import DownloadModule from './download-module'

class UtilToolbar extends React.Component {
  render() {
    return (
      <ToolbarContainer isHoriz={this.props.isToolbarHoriz}>
        <ButtonsWrapper>
          <ChatOrientModule />
          <DownloadModule canvas={this.props.canvas}/>
        </ButtonsWrapper>
      </ToolbarContainer>
    )
  }
}

const ToolbarContainer = styled.div`
  height: ${props => props.isHoriz ? '604px' : '135px'};
  width: ${props => props.isHoriz ? '135px' : '604px'};
  margin: ${props => props.isHoriz ? '125px 0 0' : '0'};
  text-align: center;
  float: left;
  background-color: 'lightblue';
`

const ButtonsWrapper = styled.div`
  margin: ${props => props.isHoriz ? '0' : '0 auto'};
`

function mapStateToProps(state) {
  return {
    isToolbarHoriz: state.utility.isToolbarHoriz
  }
}

const Connected = connect(mapStateToProps)(UtilToolbar)
export default Connected
