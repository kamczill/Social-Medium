import React, {useState} from 'react'
import { Box, Typography, Button,  useTheme, useMediaQuery } from '@mui/material'
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

import SearchBar from '../../components/SearchBar';
import FriendsList from '../../components/FriendsList';

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MyProfile from '../../components/MyProfile';

import { useSelector, useDispatch } from 'react-redux';
import { setMode, setIsMenuOpen, setLogout } from '../../state';

import { useLazyLogoutQuery } from '../../services/mainApi';

const Navbar = () => {
    const theme = useTheme();
    const isNonMobileScreen = useMediaQuery("(min-width: 1000px)");
    const [isFriendsListOpen, setIsFriendsListOpen] = useState(false)
    const navigate = useNavigate();
    const isMenuOpen = useSelector(state => state.main.isMenuOpen)
    const user = useSelector(state => state.main.user)
    const dispatch = useDispatch();
    const [logoutTrigger] = useLazyLogoutQuery()

    const logout = async () => {
      logoutTrigger()
      .then((res) => {
        dispatch(setLogout())
        dispatch(setIsMenuOpen())
        navigate('/')
      })
      .catch(() => {
        dispatch(setLogout())
        navigate('/')
    })
    }

    const handleMenuOpen = () => {
      dispatch(setIsMenuOpen())
    }


  return (
    <Box sx={{position:'sticky', top:'0', zIndex:'999', borderBottom: `1px solid ${theme.palette.neutral.light}`}}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 auto', padding: '.5rem 2rem', backgroundColor: theme.palette.background.alt}} >
        <Box sx={{cursor:'pointer'}} onClick={() => navigate('/home')}>
            <Typography variant='h3' fontWeight='bold' letterSpacing={1} color={theme.palette.primary.main}>SocialMedium</Typography>
        </Box>        
        {isNonMobileScreen ? (
            <>
                <Box width='100%' display='flex' flexDirection='row' justifyContent='center' alignItems='center' gap='0'>
                    <SearchBar />
                    <MaterialUISwitch onChange={() => dispatch(setMode())} theme={theme}/>
                </Box>
                <Box display='flex' gap='3rem' alignItems='center'>
                    <Button onClick={() => logout()}><Typography variant='h4' color={theme.palette.neutral.main} >Logout</Typography></Button>
                </Box>
                </>
        ): (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            {isMenuOpen ? <CloseIcon sx={{ fontSize: '2rem'}} onClick={() => handleMenuOpen()}/> : <MenuIcon sx={{ fontSize: '2rem' }} onClick={() => handleMenuOpen()}/>}
            </Box>
        )}
    </Box>
    {!isNonMobileScreen && isMenuOpen && (
        <Box sx={{ position:'absolute', width:'100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap:'1rem',  padding: '1.5rem 0', backgroundColor: theme.palette.background.alt, borderTop: `1px solid ${theme.palette.neutral.medium}`, boxShadow: '2'}}>
            <MyProfile />
            <Box display='flex' flexDirection='column' alignItems='center' sx={{width: '100%',gap: '1rem'}}>
                <SearchBar />
                <Box onClick={() => setIsFriendsListOpen(prev => !prev)} display='flex' alignItems='center' justifyContent='center' gap='.5rem' marginTop='2rem'>
                <Typography variant='h4' color={theme.palette.neutral.main}>Friends </Typography>
                {isFriendsListOpen ? <KeyboardArrowDownIcon sx={{fontSize:'2rem'}}/> : <KeyboardArrowUpIcon sx={{fontSize:'2rem'}}/> }
                </Box>
                {isFriendsListOpen && <Box backgroundColor={theme.palette.background.alt}><FriendsList userId={user}/></Box>}
                <MaterialUISwitch onChange={() => dispatch(setMode())} theme={theme}/>
                <Typography variant='h4' color={theme.palette.neutral.main} onClick={() => logout()}>Logout</Typography>
            </Box>
        </Box>
    )}
    </Box>
  )
}

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(6px)',
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(22px)',
        '& .MuiSwitch-thumb:before': {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            '#fff',
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
      width: 32,
      height: 32,
      '&:before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      borderRadius: 20 / 2,
    },
  }));

export default Navbar