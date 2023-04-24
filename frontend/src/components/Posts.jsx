import React, {useState, useEffect, useRef} from 'react'
import Post from './Post'
import CreatePostForm from './CreatePostForm.jsx';
import { Box, CircularProgress, Button, Menu, MenuItem } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useBottomScrollListener } from 'react-bottom-scroll-listener'
import { useDispatch } from 'react-redux';
import { setLogout } from '../state';

import { useLazyGetPostsQuery } from '../services/mainApi';


const Posts = () => {

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState(false);
  const [skip, setSkip] = useState(0)
  const [friends, setFriends] = useState(true)
  const [isBottomTouched, setIsBottomTouched] = useState(false)
  const navigate = useNavigate();
  const ref = useRef()
  const [friendsPosts, setFriendsPosts] = useState(null)
  const dispatch = useDispatch()

  const [triggerGetPosts, {isLoading: isLoadingGetPosts}] = useLazyGetPostsQuery()


  const [anchorEl, setAnchorEl] = useState(null);
  const [titleMenu, setTitleMenu] = useState('Friends Posts')
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getPosts = async (skip=0, friends=true) => {
    await triggerGetPosts({friends: friends, skip: skip})
      .then((res) => {
        setPosts(prev => [...prev, ...res.data.posts])
      }).catch(err => console.log(err))
  }

  useBottomScrollListener(() => {
    getPosts(skip, friends);
    setSkip(prev => prev + 1)
  })

  useEffect(() => {
    if (friendsPosts == true) {
      setAnchorEl(null)
      setFriends(true)
      setSkip(1)
      setPosts([])
      setTimeout(() => getPosts(0, true), 300)
      setTitleMenu('Friends Posts')
    } else if (friendsPosts == false) {
      setAnchorEl(null)
      setFriends(false)
      setSkip(1)
      setPosts([])
      setTimeout(() => getPosts(0, false), 300)
      setTitleMenu('All Posts')
    }
  }, [friendsPosts])
  

  useEffect(() => {
    getPosts(skip, friends);
    setSkip(prev => prev + 1)
  }, [])

  return (
    <Box  display='flex' flexDirection='column' flex='3' gap='2rem'>
      <CreatePostForm setNewPost={setNewPost}/>

      <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {titleMenu}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => setFriendsPosts(true)}>Friends Posts</MenuItem>
        <MenuItem onClick={() => setFriendsPosts(false)}>All Posts</MenuItem>
      </Menu>
    </div>

      {posts?.map((post, index) => <Post key={index} postData={post}/>)}
      {isLoadingGetPosts && (
      <Box display='flex' justifyContent='center'>
        <CircularProgress size='4rem'/>
      </Box>
      )}
    </Box>
  )
}

export default Posts