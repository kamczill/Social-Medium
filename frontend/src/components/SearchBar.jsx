import React, {useEffect, useState} from 'react'
import { Box, TextField, Avatar, Typography, useTheme} from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { useLazySearchUserQuery } from '../services/mainApi';
import { useDispatch } from 'react-redux';
import { setIsMenuOpen } from '../state';

const SearchBar = () => {

    const [users, setUsers] = useState()
    const [query, setQuery] = useState('')
    const theme = useTheme()
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [searchTrigger] = useLazySearchUserQuery()

    const getUsers = async (query) => {
        await searchTrigger(query)
            .then(res => setUsers(res?.data?.users))
    }

    const handleClick = (userId) => {
        navigate(`/profile/${userId}`)
        setQuery('')
        dispatch(setIsMenuOpen())
    }

    useEffect(() => {
        if(query.length > 0) getUsers(query)
        if(query.length == 0) setUsers()
    }, [query])

    return (
    <Box  display='flex' flexDirection='column' alignItems='center' justifyContent='center' sx={{ width: '80%', maxWidth:'300px'}}>
        <TextField value={query} onChange={(e) => setQuery(e.target.value)} disabledRipple='true' variant="standard" placeholder='Search person' 
        sx={{ width: '80vw', maxWidth:'300px', padding: '.3rem 1rem', backgroundColor: theme.palette.neutral.light, borderRadius: '7px', 
        '& .MuiInput-underline:before': { borderBottom: 'none' }, '& .MuiInput-underline:after': { borderBottomr: 'none' }}}/>
    <Box position='relative'>
        <Box sx={{ position:'absolute', left:'50%', transform:'translateX(-50%)'}} zIndex='1' width='80vw' maxWidth='300px' display='flex' flexDirection='column' backgroundColor={theme.palette.background.alt} boxShadow='3' >
            {users?.map(user => (
            <Box onClick={() => handleClick(user.id)} display='flex' justifyContent='flex-start' alignItems='center' gap='.5rem' sx={{ padding:'.3rem .5rem', backgroundColor:theme.palette.background.alt, '&:hover': {backgroundColor: theme.palette.primary.light, cursor: 'pointer'}}}>
                <Avatar src={`https://socialmedium.life/images/${user?.picturePath}`} sx={{boxShadow:'3'}}/>
                <Typography variant='h6' sx={{}}>{user.firstName} {user.lastName}</Typography>
            </Box>
            ))}</Box>
    </Box>
    </Box>
  )
}

export default SearchBar