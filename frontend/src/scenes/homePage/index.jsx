import React, {useState, useEffect, useRef} from 'react'
import Navbar from '../navbar'
import MyProfile from '../../components/MyProfile'
import Posts from '../../components/Posts'
import FriendsList from '../../components/FriendsList'

import { Box, Typography, useMediaQuery } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux';
import { setLogin } from '../../state'
import axios from 'axios';
import { useGetMeQuery } from '../../services/mainApi'
import Cookies from 'js-cookie'

const HomePage = () => {

  const isNonMobileScreen = useMediaQuery("(min-width: 1000px)");
  const isMenuOpen = useSelector(state => state.main.isMenuOpen)
  const user = useSelector(state => state.main.user)

  const cookie = document.cookie
  return (
    <div>
    <Navbar />
    
    {isNonMobileScreen ? (
      <Box display='flex' justifyContent='center' width='100%'>
        <Box margin='1rem 1rem' width='100%' maxWidth='1500px' display='flex' alignItems='flex-start' justifyContent='center' gap='1rem'>
          <MyProfile home/>
          <Posts />
          <FriendsList home userId={user}/>
        </Box>
      </Box>
    ) : (
      <Box display={(isMenuOpen && !isNonMobileScreen) ? 'none': 'static'}>
        <Posts />
      </Box>
    )}
    
    </div>
  )
}

export default HomePage