import React from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useAddCommentMutation, useGetMyDataQuery } from '../services/mainApi'

import { Box, useTheme, Button, TextField, Avatar, Typography, useMediaQuery} from '@mui/material'

const AddComment = ({ comments, setComments, postId }) => {
    const theme = useTheme();
    const isNonMobileScreen = useMediaQuery('(min-width: 1000px)');
    const user = useSelector(state => state.main.user)
    console.log(new Date().toUTCString())

    const {data: userData} = useGetMyDataQuery()

    const [addCommentTrigger] = useAddCommentMutation();


    const handleFormSubmit = async (values, onSubmitProps) => {
        await addCommentTrigger({postId, values}).then((res) => {
                console.log(res)
                setComments((prev) => [...prev,
                {
                        'firstName': userData.user.firstName,
                        'lastName': userData.user.lastName,
                        'picturePath': userData.user.picturePath,
                        'user_id': user,
                        "comment": values.comment,
                        "created_at": new Date()
                    }])
                onSubmitProps.resetForm();
            }).catch(err => console.log(err))
    }

  return (
    <>
        <Box>
                <Formik
                onSubmit={handleFormSubmit}
                initialValues={{comment: ''}}
            >
                
                {({
                    values,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                }) => (
            <form onSubmit={handleSubmit}>
                <Box display='flex' flexDirection={isNonMobileScreen ? 'row': 'column'} justifyContent={isNonMobileScreen && 'flex-start'} alignItems={isNonMobileScreen && 'flex-start'} gap='1rem'>
                <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    gap: '2rem',
                    width:'100%',
                    background: theme.palette.background.alt,
                }}>
                    
                    <TextField
                    label="Comment"
                    type="text"
                    name="comment"
                    value={values.comment}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    multiline
                    variant='standard'
                    sx={{
                    width:'80%'
                    }}
                    />
                
                </Box>
                {values.comment && <Button variant="contained" type='submit' sx={{padding:'.5rem .5rem'}}>Add comment</Button>}
                </Box>
            </form>
                )}
            </Formik>
        </Box>
    </>
    
  )
}

export default AddComment