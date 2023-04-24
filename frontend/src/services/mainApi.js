import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import axios from 'axios'
import { setLogout } from '../state'


const baseUrl = 'https://socialmedium.life'

const axiosBaseQuery =
  async ({ url, method, data, params, withCredentials, headers }) => {
    try {
      const result = await axios({ url: baseUrl + url, method, data, params, withCredentials: true, headers})
      return { data: result.data }
    } catch (axiosError) {
      let err = axiosError
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      }
    }
  }

  const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await axiosBaseQuery(args)
    if (result.error && result.error.status === 401) {
      // try to get a new token
      const refreshResult = await axiosBaseQuery({url: '/auth/refresh', method: 'get', withCredentials:true, headers: {
        // 'Content-Type': 'application/json', this header makes problem with cookie
        'Access-Control-Allow-Origin': '*',
        // 'Accept': 'application/json', this header makes problem with cookie
      }})
      if (refreshResult.data) {
        result = await axiosBaseQuery(args)
      } else {
        api.dispatch(setLogout())
      }
    }
    return result
  }

// Define a service using a base URL and expected endpointss
export const mainApi = createApi({
  reducerPath: 'mainApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (build) => ({
    login: build.mutation({
      query: (values) => ({url: '/auth/login', method: 'post', withCredentials: true, data: values, headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Accept': '*/*'
      }}),
    }),
    logout: build.query({
      query: () => ({url: '/auth/logout', method: 'get', withCredentials: true}),
    }),
    register: build.mutation({
      query: (values) => ({url: '/auth/register', method: 'post', withCredentials: true, data: {...values, picturePath: '/', viewedProfile: 0, impressions: 0}}),
    }),
    changeUserAvatar: build.mutation({
      query: (values) => ({url: '/auth/uploadphoto', method: 'put', withCredentials: true, data: {...values}, 
        headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Content-Type': 'multipart/form-data'
                }}),
    }),
    getMyData: build.query({
      query: () => ({url: `/users/me`, method: 'get', withCredentials: true}),
    }),
    getUserData: build.query({
      query: (userId) => ({url: `/users/${userId}`, method: 'get', withCredentials: true}),
    }),
    getUserFriends: build.query({
      query: (userId) => ({url: `/users/${userId}/friends`, method: 'get', withCredentials: true}),
    }),
    getUserPosts: build.query({
      query: (userId) => ({url: `/posts/${userId}`, method: 'get', withCredentials: true}),
    }),
    addOrRemoveFriend: build.mutation({
      query: ({currentUser, userID}) => ({url: `/users/${currentUser}/${userID}`, method: 'put', withCredentials: true}),
    }),
    addComment: build.mutation({
      query: ({postId, values}) => ({url: `/posts/${postId}/comment`, method: 'put', withCredentials: true, data: {...values}, headers: {
        'Access-Control-Allow-Origin': '*',
        // 'accept': 'application/json'
      }}),
    }),
    addOrRemoveLike: build.mutation({
      query: (postId) => ({url: `/posts/${postId}/like`, method: 'put', withCredentials: true, headers: {
        // 'Access-Control-Allow-Origin': '*',
        'accept': 'application/json'
      }}),
    }),
    addPost: build.mutation({
      query: (values) => ({url: `/posts/create`, method: 'post', withCredentials: true, data: {...values}, 
      headers: {
        'Access-Control-Allow-Origin': '*',
        // 'accept': 'application/json',
        "Content-Type": "multipart/form-data",
      }}),
    }),
    getPosts: build.query({
      query: ({friends, skip}) => ({url: `/posts/?friends=${friends}&skip=${skip}&limit=5`, method: 'get', withCredentials: true}),
    }),
    searchUser: build.query({
      query: (phrase) => ({url: `/users/search/${phrase}`, method: 'get', withCredentials: true})
    })
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation, useLazyLogoutQuery, useRegisterMutation, useChangeUserAvatarMutation, 
  useGetMyDataQuery, useLazyGetMyDataQuery, useGetUserDataQuery, useLazyGetUserDataQuery, 
  useGetUserFriendsQuery, useGetUserPostsQuery, useAddOrRemoveFriendMutation, useAddCommentMutation, 
  useAddOrRemoveLikeMutation, useAddPostMutation, useLazyGetPostsQuery, useLazySearchUserQuery } = mainApi
