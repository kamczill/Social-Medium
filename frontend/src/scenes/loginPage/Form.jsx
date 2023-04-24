import React, { useEffect, useState } from 'react'
import { TextField, Box, Typography, Button, Link, Alert } from '@mui/material'
import * as yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../state';
import { useLoginMutation, useRegisterMutation } from '../../services/mainApi';
import Cookies from 'js-cookie'
// https://redux-toolkit.js.org/rtk-query/usage/mutations


const initialValuesRegister = {
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    occupation: '', 
    password: '',
    passwordConfirm: '',
  }

const loginValidationSchema = yup.object({
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
})

const registerValidationSchema = yup.object({
    firstName: yup.string('Enter your name').required('Name is required').min(3, 'Min 3 letters'),
    lastName: yup.string('Enter your last name').required('Last name is required').min(3, 'Min 3 letters'),
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
    passwordConfirm: yup
        .string('Confirm your password')
        .oneOf([yup.ref('password'), null], 'Passwords must match'),
        location: yup.string().required("required"),
  occupation: yup.string().required("required"),
})



const Form = ({isLoginForm, setIsLoginForm}) => {
    const [alert, setAlert] = useState();
    const dispatch = useDispatch()
    const [loginMe] = useLoginMutation()
    const [registerMe] = useRegisterMutation()

    const loginRequest = async (values, onSubmitProps) => {
        await loginMe(values)
            .then((res) => {
                console.log(res)
                if(res?.data?.status == 'success'){
                    dispatch(setLogin({user: res?.data?.user_id}))
                    onSubmitProps.resetForm()
                } else if (res?.error?.status == 400) {
                    setAlert(<Alert severity="error">Incorrect Email or password!</Alert>)
                }
        })
        
    };
    
    const registerRequest = async (values, onSubmitProps) => {
        await registerMe(values)
            .then((res) => {
                if(res?.data?.status == 'success') {
                    setAlert(<Alert severity="success">User has been created succesfully!</Alert>)
                    onSubmitProps.resetForm();
                } else if (res?.error?.status) {
                    setAlert(<Alert severity="error">Account with this email already exist!</Alert>)
                }
        })

        
    };

    const handleFormSubmit = async (values, onSubmitProps) => {
        if (isLoginForm) await loginRequest(values, onSubmitProps)
        if (!isLoginForm) await registerRequest(values, onSubmitProps)
    }


  return (
    <>
    <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValuesRegister}
        validationSchema={isLoginForm == true ? loginValidationSchema : registerValidationSchema}
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
            gap: '.5rem',
        }}>
            {isLoginForm ? (
            <>
            <TextField
            label="E-mail"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(touched.email && Boolean(errors.email))}
            helperText={touched.email && errors.email}
            />
            <TextField
            label="Password"
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(touched.password && Boolean(errors.password))}
            helperText={touched.password && errors.password}
            autocomplete="on"
            />
            </>
        
            ): (
                <>
                {/* 
                 
                */}
                    <TextField
                    label="First Name"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.firstName && Boolean(errors.firstName))}
                    helperText={touched.firstName && errors.firstName}
                    />
                    <TextField
                    label="Last Name"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.lastName && Boolean(errors.lastName))}
                    helperText={touched.lastName && errors.lastName}
                    />
                    <TextField
                    label="E-mail"
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.email && Boolean(errors.email))}
                    helperText={touched.email && errors.email}
                    />
                    <TextField
                    label="Location"
                    name="location"
                    value={values.location}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.location && Boolean(errors.location))}
                    helperText={touched.location && errors.location}
                    />
                    <TextField
                    label="Occupation"
                    name="occupation"
                    value={values.occupation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.occupation && Boolean(errors.occupation))}
                    helperText={touched.occupation && errors.occupation}
                    />
                    <TextField
                    label="Password"
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.password && Boolean(errors.password))}
                    helperText={touched.password && errors.password}
                    autoComplete='on'
                    />
                    <TextField
                    label="Password Confirm"
                    type="password"
                    name="passwordConfirm"
                    value={values.passwordConfirm}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.passwordConfirm && Boolean(errors.passwordConfirm))}
                    helperText={touched.passwordConfirm && errors.passwordConfirm}
                    autoComplete='on'
                    />
                </>
            )
        }
        <Button variant="contained" type='submit' sx={{px:'2rem'}}>{isLoginForm ? 'Login' : 'Register'}</Button>
        </Box>
    </form>
        )}
    </Formik>
    {alert}
    <Link href='#' onClick={() => setIsLoginForm(prev => !prev)}>
        <Typography>{isLoginForm ? "You don't have an account? Sign up here!" : "You have an account? Login here!" }</Typography>
    </Link>
    </>
  )
}

export default Form