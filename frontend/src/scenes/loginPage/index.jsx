import React, {useState} from 'react'
import { Box, Typography, useTheme} from '@mui/material';
import { useSelector } from 'react-redux'
import Form from './Form';
import FormContainer from './components'
import axios from 'axios';


const LoginPage = () => {
  const theme = useTheme();
  const [isLoginForm, setIsLoginForm] = useState(true)
  const mode  = useSelector(state => state.main.mode)


  

  return (
    <>
      <Box  sx={{ 
        width: '100%', 
        height: isLoginForm ? '100vh' : 'auto', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
        }}
        >   
        <FormContainer>
          <Typography variant='h1' color={theme.palette.primary.main} fontWeight='bold'>Social Medium</Typography>
          <Form isLoginForm={isLoginForm} setIsLoginForm={setIsLoginForm}/>
          </FormContainer>
      </Box>
    </>
  )
}

export default LoginPage;