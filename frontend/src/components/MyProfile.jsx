import React, {useState} from 'react'
import {Box, Typography, Avatar, useTheme} from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsMenuOpen } from '../state'
import { useGetMyDataQuery } from '../services/mainApi';


const MyProfile = ({ home=false}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const {data: userData} = useGetMyDataQuery({refetchOnMountOrArgChange:true})
    
  const handleClick = () => {
    dispatch(setIsMenuOpen());
    navigate(`/profile/${userData?.user?.id}`)
  }

  return (
    <Box display='flex' flexDirection='column' flex='1' gap='1.5rem' backgroundColor={theme.palette.background.alt} padding='1.3rem' boxShadow={home && 2}>
        <Box onClick={() => handleClick()} display='flex' justifyContent='center' alignItems='center' gap='1rem' borderRadius='5px' padding='1rem'  sx={{cursor: 'pointer', "&:hover": { backgroundColor: theme.palette.primary.light}}}> 
        <Avatar src={`https://socialmedium.life/images/${userData?.user?.picturePath}`} sx={{ width: '60px', height:'60px', boxShadow: 4}}></Avatar>
        <Typography fontSize='1.2rem' color={theme.palette.primary.dark}>{userData?.user?.firstName} {userData?.user?.lastName}</Typography>
        </Box>
        {home && 
          <Box display='flex' flexDirection='column'>
              <Typography fontSize='1rem'>Location: <strong>{userData?.user?.location}</strong></Typography>
              <Typography fontSize='1rem'>Occupation: <strong>{userData?.user?.occupation}</strong></Typography>
              <Typography fontSize='1rem'>E-mail: <strong>{userData?.user?.email}</strong></Typography>
          </Box>
        }
    </Box>
  )
}



export default MyProfile