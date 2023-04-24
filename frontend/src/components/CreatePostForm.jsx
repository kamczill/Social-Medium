import React, {useState} from 'react'
import { Box, Typography, TextField, Button, useTheme } from '@mui/material'
import * as yup from 'yup'
import { Formik } from 'formik'
import axios from 'axios'
import { useDropzone } from 'react-dropzone'

import { useAddPostMutation } from '../services/mainApi'

const initialValues = {
    description: '',
    file: null
  }

const validationFileSchema = yup.object({
  description: yup
      .string().when('file', {
        is: false,
        then: schema => schema.string().required('At least one of the fields is required')
      })
})



const CreatePostForm = ({ setNewPost}) => {
    const [image, setImage] = useState([]);
    const theme = useTheme();
    const [addPostTrigger]  = useAddPostMutation()


    const handleFormSubmit = async (values, onSubmitProps) => {
      console.log(values)
      addPostTrigger(values)
        .then((res) => {
            onSubmitProps.resetForm();
            window.location.reload()
        })
        .catch(err => console.log(err))
        setNewPost(prev => !prev)
    }

  return (
    <Box>
        <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
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
        <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2rem',
            background: theme.palette.background.alt,
            padding: '2rem 0',
            boxShadow:'2'
        }}>
            <>
            <TextField
            label="Express yourself"
            type="text"
            name="description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            multiline
            variant='standard'
            sx={{
              width:'80%'
            }}
            />

            <UploadComponent setFieldValue={setFieldValue} />
            {values.file && (
                <li>
                {`File:${values.file.name} Size:${values.file.size} bytes`}{" "}
                </li>
            )}
            <div>{errors.file? errors.file: ''}</div>
            </>
        
        {values.description || values.file ? <Button variant="contained" type='submit' sx={{px:'2rem'}}>POST</Button>: ''}
        </Box>
    </form>
        )}
    </Formik>
    </Box>
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
          padding: '2rem',
          margin: '0 2rem',
          borderRadius: '10px',
          border: `2px dashed ${theme.palette.primary.main}`,
          cursor: 'pointer',
          backgroundColor: `${isDragActive ? theme.palette.primary.light: ''}`,
          '&:hover': {
            backgroundColor: `${theme.palette.background.default}`
          }
        }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop picture here, or click to select picture</p>
          )}
        </Box>
      </div>
    );
  };
  

export default CreatePostForm