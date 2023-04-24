import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Typography, Avatar, useTheme, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { setIsMenuOpen } from '../state'
import { useGetUserFriendsQuery } from '../services/mainApi'

const FriendsList = ({home=false, userId}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMenuOpen = useSelector(state => state.main.isMenuOpen)
  const dispatch = useDispatch()
  
  const { data, isLoading } = useGetUserFriendsQuery(userId, {refetchOnMountOrArgChange: true})
  

  const handleClick = (friendId) => {
    if(isMenuOpen) dispatch(setIsMenuOpen())
    navigate(`/profile/${friendId}`)
  }


  return (
      <Box sx={{
        display:'flex',
        flexDirection: 'column',
        backgroundColor: home ? theme.palette.background.alt : theme.palette.background.default,
        padding: '1rem',
        flex:'1',
        boxShadow: home && '2'
      }}>
        { home && <Typography variant='h3' textAlign='center'>Friends list</Typography> }
        <Box sx={{
        display:'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: home ? '0': '1rem',
        backgroundColor: home ? theme.palette.background.alt : theme.palette.background.default,
        padding: home && '2rem',
      }}>
        {isLoading && <Box display='flex' justifyContent='center' alignItems='center'><CircularProgress /></Box>}
        {data?.friends?.map(friend => (
          <Box onClick={() => handleClick(friend.id)} width='100%' display='flex' flexDirection='row' justifyContent='flex-start' alignItems='center' gap='1rem' padding='.3rem 1rem' borderRadius='5px' backgroundColor={theme.palette.background.alt}  sx={{cursor: 'pointer', "&:hover": { backgroundColor: theme.palette.primary.light} }}>
            <Avatar src={`https://socialmedium.life/images/${friend.picturePath}`}></Avatar>
            <Box ><Typography variant='h5'>{friend.firstName} {friend.lastName}</Typography></Box>
          </Box>
        ))}
        {data?.friends?.length == 0 && <Typography>Alone person :c </Typography>}
        </Box>
      </Box>
  )
}

export default FriendsList