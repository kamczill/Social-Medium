import React, { useState, useEffect } from 'react'
import { Box, Avatar, Typography, useTheme, useMediaQuery, Link } from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { Image } from 'mui-image'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddComment from './AddComment';
import { useAddOrRemoveLikeMutation, useGetUserDataQuery } from '../services/mainApi';




const Post = ({postData}) => {
  const theme = useTheme()
  const [data, setData] = useState(postData)
  const [comments, setComments] = useState(data?.comments)
  const [newComments, setNewComments] = useState([])
  const date = convertUTCDateToLocalDate(new Date(data.created_at)).toLocaleString();
  const user = useSelector(state => state.main.user)
  const [isLike, setIsLike] = useState(data.likes.includes(user) ? true : false)
  const [isComment, setIsComment] = useState(false)
  const navigate = useNavigate();

  const [addOrRemoveLikeTrigger] = useAddOrRemoveLikeMutation()
  const {data: userData} = useGetUserDataQuery(data?.user_id)

  function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();
    newDate.setHours(hours - offset);
    return newDate;   
  }

  const getDate = (date) => {
    const newDate = new Date(date)
    const dateString = newDate.toLocaleString()
    return dateString
  }

  const getLike = async () => {
    await addOrRemoveLikeTrigger(data?.id)
      .then(res => setData(res.data.post))
      .catch(err => console.log(err))
  }
  

  const handleLike = () => {
    getLike();
    setIsLike(!isLike)
  }
  

  return (
    <Box display='flex' flexDirection='column' alignItems='center' backgroundColor={theme.palette.background.alt} mx='1rem' p='1rem' boxShadow={2}>
      <Box width='100%' display='flex' flexDirection='column' gap='1rem'>
        <Box display='flex' justifyContent='flex-start' alignItems='center' gap='1rem'>
          <Avatar src={`https://socialmedium.life/images/${userData?.user?.picturePath}`} onClick={() => navigate(`/profile/${postData.user_id}`)} sx={{ width: '3rem', height: '3rem', boxShadow: 4, cursor: 'pointer'}}></Avatar>
          <Box display='flex' flexDirection='column'>
          <Typography onClick={() => navigate(`/profile/${postData.user_id}`)} variant='h5' fontWeight='bold' color={theme.palette.neutral.dark}  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline'}}}>{`${data?.firstName} ${data?.lastName}`}</Typography>
          <Typography variant='h6' color={theme.palette.neutral.mediumMain}>{date}</Typography>
          </Box>
        </Box>
        { data?.description != '' && (
          <Box width="100%">
          <Typography width='100%' sx={{overflowWrap: 'break-word'}}>{data?.description}</Typography>
        </Box>
        )}
        { data?.picturePath && (
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Box width='100%' maxWidth='500px' >
            <Image src={`https://socialmedium.life/images/${data?.picturePath}`}  duration='1000'  sx={{ borderRadius: '1rem', boxShadow:3 }}/>
            </Box>
          </Box>
        )}
        <Box display='flex' gap='2rem'>
          <Box display='flex' alignItems='center' gap='.3rem' onClick={() => handleLike()}>
            {isLike ? <ThumbUpIcon  sx={{ fontSize:'1.7rem', color: theme.palette.primary.main, cursor: 'pointer'}} /> : <ThumbUpOffAltIcon sx={{ fontSize:'1.7rem', cursor: 'pointer' }} /> }
            <Typography variant='h5'>{data?.likes.length}</Typography>
          </Box>
          <Box display='flex' alignItems='center' gap='.3rem' onClick={() => setIsComment(!isComment)}>
            {isComment ? <ChatBubbleIcon  sx={{ fontSize:'1.7rem', color: theme.palette.primary.main, cursor: 'pointer' }} /> : <ChatBubbleOutlineIcon sx={{ fontSize:'1.7rem', cursor: 'pointer' }} /> }
            <Typography variant='h5' >{data?.comments.length + newComments.length}</Typography>
          </Box>
        </Box>
        {isComment && (
          <Box>
            <AddComment comments={newComments} setComments={setNewComments} postId={data.id} userData={{
              'firstName': userData?.user?.firstName, 
              'lastName': userData?.user?.lastName, 
              'picturePath':userData?.user?.picturePath}}/>
            <Box display='flex' flexDirection='column' gap='1rem' marginTop='2rem'>
              {comments?.map((comment) => (
                <Box display='flex' gap='1rem'>
                    <Avatar src={`https://socialmedium.life/images/${comment?.picturePath}`} onClick={() => navigate(`/profile/${comment?.user_id}`)}  sx={{cursor: 'pointer', boxShadow:'4'}} />
                    <Box display='flex' flexDirection='column'>
                      <Box backgroundColor={theme.palette.neutral.light} borderRadius='10px' padding='.5rem 1rem'>
                        <Typography onClick={() => navigate(`/profile/${comment?.user_id}`)} variant='h6' sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline'}}}>{comment?.firstName} {comment?.lastName}</Typography>
                        <Typography sx={{wordBreak: 'break-all'}}>{comment?.comment}</Typography>
                      </Box>
                      <Typography color={theme.palette.neutral.mediumMain}>{convertUTCDateToLocalDate(new Date(comment?.created_at)).toLocaleString()}</Typography>
                    </Box>
                </Box>
              ))}
              {newComments?.map((comment) => (
                <Box display='flex' gap='1rem'>
                <Avatar src={`https://socialmedium.life/images/${comment?.picturePath}`} onClick={() => navigate(`/profile/${comment?.user_id}`)}  sx={{cursor: 'pointer', boxShadow:'4'}} />
                <Box display='flex' flexDirection='column'>
                  <Box backgroundColor={theme.palette.neutral.light} borderRadius='10px' padding='.5rem 1rem'>
                    <Typography onClick={() => navigate(`/profile/${comment?.user_id}`)} variant='h6' sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline'}}}>{comment?.firstName} {comment?.lastName}</Typography>
                    <Typography sx={{wordBreak: 'break-all'}}>{comment?.comment}</Typography>
                  </Box>
                  <Typography color={theme.palette.neutral.mediumMain}>{getDate(comment.created_at)}</Typography>
                </Box>
            </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Post