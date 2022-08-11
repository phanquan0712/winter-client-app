import { UN_FOLLOW } from './../types/userType';
import { IAuthType, AUTH } from './../types/authType';
import { IAlertType, ALERT } from './../types/alertType';
import { GET_USER, LOAD_USER_POST, IUpdateProfile, FOLLOW, IProfileType, GET_POST_USER } from "../types/userType";
import { Dispatch } from 'react';
import { getApi, patchApi } from '../../utils/fetchData';
import { imageUpload, checkImage } from '../../utils/imageUpload';
import { IAuth } from './../types/authType';
import { IPost, IUser } from '../../utils/Typescript';
import { Socket } from 'socket.io-client';
import { createNotify } from './notifyAction';

export const getProfileUser = (id: string, token?: string) => {
   return async (dispatch: Dispatch<IAlertType | IProfileType>) => {
      try {
         const resUser = await getApi(`user/${id}`, token);
         dispatch({ type: LOAD_USER_POST, payload: true })
         const resPost = await getApi(`user_posts/${id}`, token)

         dispatch({ type: GET_USER, payload: resUser.data.user });
         dispatch({ type: GET_POST_USER, payload: { total: resPost.data.total, posts: (resPost.data.posts as IPost[]), page: 2, _id: id } });
         dispatch({ type: ALERT, payload: { loading: false } })
      } catch (err: any) {
         dispatch({ type: ALERT, payload: { error: err.response.data.msg } })
      }
   }
}

export const updateProfileUser = (data: IUpdateProfile, auth: IAuth) => {
   return async (dispatch: Dispatch<IAlertType | IAuthType>) => {
      if (!data.fullname.length) return dispatch({ type: ALERT, payload: { error: 'Please, Add your full name' } })
      if (data.fullname.length > 25) return dispatch({ type: ALERT, payload: { error: 'Your full name is too long' } })
      if (data.story.length > 200) return dispatch({ type: ALERT, payload: { error: 'Your story is too long' } })
      let url = '';
      if (!auth.access_token || !auth.user) return dispatch({ type: ALERT, payload: { error: 'Please, login to update your profile' } })
      try {
         dispatch({ type: ALERT, payload: { loading: true } })

         if (data.avatar) {
            const check = checkImage((data.avatar as File))
            if (check) {
               return dispatch({ type: ALERT, payload: { error: check } })
            }
            const photo = await imageUpload((data.avatar as File))
            url = photo.url
         }


         const newUser: IUser = {
            ...auth.user,
            avatar: url ? url : auth.user?.avatar,
            fullname: data.fullname ? data.fullname : auth.user?.fullname,
            story: data.story ? data.story : auth.user?.story,
            mobile: data.mobile ? data.mobile : auth.user?.mobile,
            address: data.address ? data.address : auth.user?.address,
            website: data.website ? data.website : auth.user?.website,
            gender: data.gender ? data.gender : auth.user?.gender,
         }

         if (JSON.stringify(auth.user) === JSON.stringify(newUser)) {
            return dispatch({ type: ALERT, payload: { error: 'Data is not change', errCode: 1 } })
         }
         const res = await patchApi('user', {
            ...data,
            avatar: url ? url : auth.user?.avatar
         }, auth.access_token);

         dispatch({
            type: AUTH,
            payload: {
               access_token: auth.access_token,
               user: {
                  ...auth.user,
                  avatar: url ? url : auth.user?.avatar,
                  fullname: data.fullname ? data.fullname : auth.user?.fullname,
                  story: data.story ? data.story : auth.user?.story,
                  mobile: data.mobile ? data.mobile : auth.user?.mobile,
                  address: data.address ? data.address : auth.user?.address,
                  website: data.website ? data.website : auth.user?.website,
                  gender: data.gender ? data.gender : auth.user?.gender,
               }
            }
         })

         dispatch({ type: ALERT, payload: { success: res.data.msg, errCode: 2 } })
      } catch (err: any) {
         dispatch({ type: ALERT, payload: { error: err.response.data.msg } })
      }
   }
}

export const follow = (users: IUser[], user: IUser, auth: IAuth, socket: Socket) => async (dispatch: Dispatch<IAlertType | IProfileType | IAuthType>) => {
   if (!auth.access_token || !auth.user) return dispatch({ type: ALERT, payload: { error: 'Please, login to follow' } })
   
   let newUser;
   if (users.every(item => item._id !== user._id)) {
      newUser = { ...user, followers: [...user.followers, auth.user] }
   } else {
      users.forEach(item => {
         if (item._id === user._id) {
            newUser = { ...item, followers: [...item.followers, auth.user] }
         }
      })
   }
   dispatch({ type: FOLLOW, payload: (newUser as IUser) })
   dispatch({
      type: AUTH,
      payload: {
         access_token: auth.access_token,
         user: {
            ...auth.user,
            following: [...auth.user.following, (newUser as IUser)]
         }
      }
   })
   try {
      await patchApi(`/user/${user._id}/follow`, {}, auth.access_token);

      // SOCKET
      socket.emit('follow', newUser)


      const msg = {
         id: auth.user._id,
         text: 'has started to follow you',
         recipients: [user],
         url: `/profile/${auth.user._id}`,
         image: user.avatar
      }

      dispatch((createNotify(msg, auth, socket) as any))

   } catch (err: any) {
      dispatch({ type: ALERT, payload: { error: err.response.data.msg } })
   }
}

export const unfollow = (users: IUser[], user: IUser, auth: IAuth, socket: Socket) => async (dispatch: Dispatch<IAlertType | IProfileType | IAuthType>) => {
   const newUser = { ...user, followers: user.followers.filter(follower => follower._id !== auth.user?._id) }
   if (!auth.access_token || !auth.user) return dispatch({ type: ALERT, payload: { error: 'Please, login to follow' } })

   dispatch({ type: UN_FOLLOW, payload: (newUser as IUser) })
   dispatch({
      type: AUTH,
      payload: {
         access_token: auth.access_token,
         user: {
            ...auth.user,
            following: auth.user.following.filter(follower => follower._id !== (newUser as IUser)._id)
         }
      }
   })
   try {
      await patchApi(`/user/${user._id}/unfollow`, {}, auth.access_token);

      // SOCKET
      socket.emit('unFollow', newUser)
   } catch (err: any) {
      dispatch({ type: ALERT, payload: { error: err.response.data.msg } })
   }
}