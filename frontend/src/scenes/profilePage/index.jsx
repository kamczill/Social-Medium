import React, { useState, useEffect} from 'react'
import Navbar from '../navbar'
import CreatePostForm from '../../components/CreatePostForm'
import Post from '../../components/Post'
import { Box, Typography, Avatar, useTheme, useMediaQuery, Button } from '@mui/material'
import { useLocation, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDropzone } from 'react-dropzone'
import { Formik } from 'formik'
import * as yup from 'yup'

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


import axios from 'axios'
import FriendsList from '../../components/FriendsList'

import { useAddOrRemoveFriendMutation, useChangeUserAvatarMutation, useGetMyDataQuery, useGetUserDataQuery, useGetUserPostsQuery, useLazyGetMyDataQuery } from '../../services/mainApi'

const validationFileSchema = yup.object({
  file: yup.mixed().required()
})



const ProfilePage = () => {

  const { userId } = useParams();
  const [isFriendsListOpen, setIsFriendsListOpen] = useState()
  const user = useSelector(state => state.main.user) 
  const isMenuOpen = useSelector(state => state.main.isMenuOpen)
  const theme = useTheme();
  const isNonMobileScreen = useMediaQuery('(min-width: 1000px)');
  
  const [isFriend, setIsFriend] = useState(null)
  const { data: userData} = useGetUserDataQuery(userId, {refetchOnMountOrArgChange: true, refetchOnReconnect: true})
  const {data: userPosts} = useGetUserPostsQuery(userId, {refetchOnMountOrArgChange: true})
  const [addOrRemoveFriend] = useAddOrRemoveFriendMutation()
  const [trigger, {isLoading: isLoadingMyData}] = useLazyGetMyDataQuery()

  
  const handleAddOrRemoveFriend = async() => {
    await addOrRemoveFriend({currentUser: user, userID: userId})
    setIsFriend(prev => !prev)
  }

  useEffect(() => {
      trigger().then(res => setIsFriend(res?.data?.user?.friends?.includes(userId)))
  }, [])


  return (
    <>
    <Navbar />
    <Box display={(isMenuOpen && !isNonMobileScreen) ? 'none': 'flex'} justifyContent='center'>
      <Box width='100%' maxWidth='1600px' display='flex' flexDirection={((isNonMobileScreen) && (userPosts?.posts?.length > 0)) ? 'row' : 'column'} alignItems='flex-start' justifyContent='center' margin='1rem' gap='1rem'>
        <Box width='100%' display='flex' flexDirection='column' alignItems='center' flex={userPosts ? '1.5' : '3'} padding='2rem' backgroundColor={theme.palette.background.alt} boxShadow='2'>
          <Box display='flex' flexDirection='column' flexWrap='wrap' justifyContent='center' alignItems='center' gap='1rem' padding='1.5rem'>
            <Box position='relative'>
            <Avatar position='relative' src={`https://socialmedium.life/images/${userData?.user?.picturePath}`} sx={{ width: 'clamp(3rem, 50vw, 15rem)', height:'clamp(5rem, 50vw, 15rem)', boxShadow: '4'}} />
            { userId != user &&
            <Box onClick={() => handleAddOrRemoveFriend()} position='absolute' right='clamp(2vw, 3rem, 4vw)' top='0' sx={{cursor:'pointer'}}>
              
              {
                isLoadingMyData 
                ? '' 
                : isFriend 
                  ? <RemoveIcon sx={{fontSize:'2.5rem', color: 'black', backgroundColor: theme.palette.primary.main, borderRadius:'50%', '&:hover': {backgroundColor: theme.palette.primary.dark}}}/> 
                  : <AddIcon sx={{fontSize:'2.5rem', color: 'black', backgroundColor: theme.palette.primary.main, borderRadius:'50%', '&:hover': {backgroundColor: theme.palette.primary.dark}}}/>
              }
            </Box>
            }
            </Box>
            {user == userId && <Form />}
            <Typography variant='h2'>{userData?.user?.firstName} {userData?.user?.lastName}</Typography>
          </Box>            
          <Box display='flex' flexDirection='row' flexWrap='wrap' justifyContent='center'  gap='1rem' padding='0rem'>
            <Typography variant='h4' color={theme.palette.neutral.main}><strong>Location:</strong> <span style={{textTransform:'capitalize'}}>{userData?.user?.location}</span></Typography>
            <Typography variant='h4' color={theme.palette.neutral.main}><strong>Occupation:</strong> <span style={{textTransform:'capitalize'}}>{userData?.user?.occupation}</span></Typography>
            <Typography variant='h4' color={theme.palette.neutral.main}><strong>Email:</strong> {userData?.user?.email}</Typography>
          </Box>
          <Box onClick={() => setIsFriendsListOpen(prev => !prev)} display='flex' alignItems='center' justifyContent='center' gap='.5rem' marginTop='2rem' sx={{cursor:'pointer'}}>
            <Typography variant='h4' color={theme.palette.neutral.main}>Friends </Typography>
              {isFriendsListOpen ? <KeyboardArrowDownIcon sx={{fontSize:'2rem'}}/> : <KeyboardArrowUpIcon sx={{fontSize:'2rem'}}/> }
          </Box>
          {isFriendsListOpen && <Box backgroundColor={theme.palette.background.alt}><FriendsList userId={userId}/></Box>}
        </Box>
        <Box display='flex' flexDirection='column' flex={userPosts? '3': '0'} gap='2rem' width='100%'>
          {user == userId && <CreatePostForm />}
          {userPosts?.posts?.map((post, index) => <Post key={index} postData={post}/>)}
        </Box>
      </Box>
    </Box>
    </>
  )
}

const Form = () => {
  const [changeAvatarTrigger] = useChangeUserAvatarMutation()

  const handleFormSubmit = async (values, onSubmitProps) => {

    await changeAvatarTrigger(values).then((res) => {
      onSubmitProps.resetForm();
      window.location.reload()
    }).catch(err => console.log(err))
  }

  return(
    <>
      <Formik
          onSubmit={handleFormSubmit}
          initialValues={{file: null}}
          validationSchema={validationFileSchema}
      >
          {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue,
              resetForm,
              initialValues
          }) => (
      <form onSubmit={handleSubmit}>
              <UploadComponent setFieldValue={setFieldValue} />
              {values.file && (
                  <li>
                  {`File:${values.file.name} Size:${values.file.size} bytes`}{" "}
                  </li>
              )}
              <div>{errors.file? errors.file: ''}</div>
          {values.file ? <Box display='flex' justifyContent='center'><Button variant="contained" type='submit'>CHANGE</Button></Box>: ''}
      </form>
          )}
      </Formik>
    </>
  )

}

const UploadComponent = props => {
  const theme = useTheme();
  const { setFieldValue } = props;
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
     },
    onDrop: acceptedFiles => setFieldValue("file", acceptedFiles[0]),
    noClick: true
  });
  return (
    <div>
      <Box {...getRootProps({ className: "dropzone" })} 
        onClick={open}
        sx={{
          padding: '0 2rem',
          borderRadius: '10px',
          // border: `2px solid ${theme.palette.neutral.medium}`,
          color: theme.palette.neutral.medium,
          cursor: 'pointer',
          textAlign: 'center',
          backgroundColor: theme.palette.background.default,
          '&:hover': {
            backgroundColor: `${theme.palette.primary.light}`
          }
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the photo here ...</p>
        ) : (
          <p>Change avatar</p>
        )}
      </Box>
    </div>
  );
};


export default ProfilePage