import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'

import { color, border } from '../../utils/color'
import { device } from '../../utils/device'
import FunctionBar from '../FunctionBar/FunctionBar'
import Button from '../other/Button'
import DropDownIcon from '../other/DropDownIcon'
import Loader from '../other/Loader'
import Repo from './Repo'
import InfiniteScroll from '../other/InfiniteScroll'

import {
  fetchRepos,
  selectRepoIds,
  selectRepoIdsPart,
  moreData
} from './reposSlice'

const StyledRepositories = styled.div`
width: 75%;

.mobile {
  display: none;
}

@media ${device.mobileL} {
  width: 100%;
  .mobile {
    display: block;
    overflow-x: auto;
    .container {
      justify-content: flex-start;
    }
  }
}
`

const Container = styled.div`
`

const WrapperTopContainer = styled.div`
padding: 15px;
`

const WrapperTop = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
margin-bottom: 15px;

.wrapper {
  margin-right: 5px;
}

@media ${device.mobileL} {
  flex-direction: column;
  
  .newbutton {
    order:-1;
  }

  & > button {
    margin-bottom: 25px;
  }
}
`

const Bar = styled.div`
display: flex;
flex-direction: row;
flex-grow: 1;

@media ${device.mobileL} {
  flex-direction: column;

  & > input {
    margin-bottom: 10px;
  }
}
`

const SearchBar = styled.input`
flex-grow: 3;
max-width: 600px;
border: 2px solid ${border.main};
padding: 5px;
border-radius: 5px;
margin-right: 10px; 

@media ${device.mobileL} {
  margin-right: 0px; 
}
`

const ClassifyButton = styled.div`
flex-grow: 1;
display: flex;
flex-direction: row;

button{
  margin-left: 5px;
  margin-right: 2px;
}

@media ${device.mobileL} {
  button{
    margin-left: 0px;
    margin-right: 3px;
  }
}

`

const BorderLine = styled.div`
border-bottom: 1px solid ${border.main}; 
`


function Repositories() {
  const dispatch = useDispatch()
  const repoStatus = useSelector((state) => state.repos.repoStatus)
  const repoIds = useSelector(selectRepoIds)
  const page = useSelector((state) => state.repos.page)
  const repoIdsPart = useSelector((state) => selectRepoIdsPart(state, page))

  const [hasMoreData, setHasMoreData] = useState(false)

  useEffect(() => {
    function initialize() {
      if (repoStatus === 'idle') {
        dispatch(fetchRepos())
      }
    }
    initialize()
  })

  useEffect(() => {
    repoIds.length > repoIdsPart.length ? setHasMoreData(true) : setHasMoreData(false)
  }, [repoIds, repoIdsPart])

  let content
  if (repoStatus === 'loading') {
    content = <Repo type="loading"></Repo>
  } 
  else if (repoStatus === 'succeeded') {
    content = repoIdsPart.map((repoId) => <Repo key={repoId} repoId={repoId} type="normal"> </Repo>)
  }
  else if (repoStatus === 'failed') {
    content = <Repo type="failed"> </Repo>
  }

  return (
    <StyledRepositories>
      <Container>
        <FunctionBar StyledFunctionBarClassName="mobile" ContainerClassName="container"></FunctionBar>
        <WrapperTopContainer>
          <WrapperTop>
            <Bar>
              <SearchBar/>
              <ClassifyButton>
                <Button theme='main'>
                Type
                  <DropDownIcon color={color.primary}></DropDownIcon>
                </Button>
                <Button theme='main'>
                Language
                  <DropDownIcon color={color.primary}></DropDownIcon>
                </Button>
                <Button theme='main'>
                Sort
                  <DropDownIcon color={color.primary}></DropDownIcon>
                </Button>
              </ClassifyButton>
            </Bar>
            <Button theme="new" className="newbutton">
              <FontAwesomeIcon icon={faPlusSquare} className='wrapper'></FontAwesomeIcon>
              New
            </Button>
          </WrapperTop>
          <BorderLine/>
        </WrapperTopContainer>

        <InfiniteScroll
          dataLength={repoIdsPart}
          next={() => {
            dispatch(moreData())
          }}
          hasMore={hasMoreData}
          loader={<Loader/>}
        >

          {content}

        </InfiniteScroll>

      </Container>
    </StyledRepositories>
  )
}

export default Repositories