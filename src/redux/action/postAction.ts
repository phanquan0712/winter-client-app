import { AUTH, IAuthType } from './../types/authType';
import { UPDATE_POST, LIKE_POST, UN_LIKE_POST, POST_LOAD, DELETE_POST } from './../types/postType';
import { deleteApi, getApi, patchApi, postAPi } from './../../utils/fetchData';
import { Dispatch } from "react";
import { CREATE_POST, GET_POST, IPostType, GET_DETAIL_POST, IGetDetailPostType } from "../types/postType";
import { ALERT, IAlertType } from "../types/alertType";
import { IAuth } from "../types/authType";
import { imageUpload } from "../../utils/imageUpload";
import { IStatus } from "../types/statusType";
import { IPost } from '../../utils/Typescript';
import { ICommentType, OPEN_MODAL_COMMENT } from "../types/commentType";
import { UPDATE_ONE_POST_DISCOVER, IPostDiscoverType } from '../types/discoverType';
import { Socket } from 'socket.io-client';
import { createNotify, deleteNotify } from './notifyAction';



export const createPost = (content: string, images: any[], auth: IAuth, socket: Socket) => async(dispatch: Dispatch<IPostDiscoverType |IPostType | IAlertType>) => {
   if(!auth.access_token || !auth.user) return dispatch({ type: ALERT, payload: { error: "Please login to create a post" } });
   let media = []
   
   try {
      dispatch({ type: ALERT, payload: { loading: true}})
      if(images.length > 0) {
         for(const item of images) {
            if(item.camera) {
               media.push(await imageUpload(item.camera))
            } else {
               media.push(await imageUpload(item))
            }
         }
      }
      
      const res = await postAPi('posts', { content, images: media}, auth.access_token)
      console.log(res);
      dispatch({ type: CREATE_POST, payload: res.data.post })

      if(auth.user.following.find(item => item._id === res.data.post.user)) {
         
      }
      dispatch({ type: ALERT, payload: { loading: false}})


      // Notify
      const msg = {
         id: res.data.post._id,
         text: 'Added a new post',
         recipients: res.data.post.user.followers,
         url: `/posts/${res.data.post._id}`,
         content,
         image: media[0].url
      }

      dispatch((createNotify(msg, auth, socket) as any))
   } catch(err: any) {
      dispatch({ type: ALERT, payload: {  error: err.response.data.msg }})
   }
}

export const getPost = (token: string, limit: number = 1) => async(dispatch: Dispatch<IPostDiscoverType |IAlertType | IPostType>) => {
   if(!token) return dispatch({ type: ALERT, payload: { error: 'Please, login to your account and try again' } });
   try {
      dispatch({ type: POST_LOAD, payload: true})
      const res = await getApi(`posts?limit=${limit * 9}`, token)
      dispatch({
         type: GET_POST,
         payload: {...res.data, page: limit},
      })
   } catch(err: any) {
      dispatch({ type: ALERT, payload: { error: err.response.data.msg }})
   }
}

export const getPostNew = (token: string, limit: number = 1) => async(dispatch: Dispatch<IPostDiscoverType |IAlertType | IPostType>) => {
   if(!token) return dispatch({ type: ALERT, payload: { error: 'Please, login to your account and try again' } });
   try {
      const res = await getApi(`posts?limit=${limit * 9}`, token)
      dispatch({
         type: GET_POST,
         payload: {...res.data},
      })
   } catch(err: any) {
      dispatch({ type: ALERT, payload: { error: err.response.data.msg }})
   }
}

export const updatePost = (content: string, images: any[], auth: IAuth, status: IStatus) => async(dispatch: Dispatch<IPostDiscoverType |IPostType | IAlertType>) => {
   if(!auth.access_token || !auth.user) return dispatch({ type: ALERT, payload: { error: 'Please, login to your account' } });
   console.log(images)
   const imgNewUrl = images.filter(img => !img.url); // new image uploaded
   const imgOldUrl = images.filter(img => img.url); // Old image converted to string on the cloudinary server  
   // if(status.post.content === content && imgNewUrl.length === 0) return dispatch({ type: ALERT, payload: { error: 'Data not change!' } });
   // if(status.post.content === content && status.post.images.length === imgOldUrl.length) return dispatch({ type: ALERT, payload: { error: 'Data not change!' } });
   if(JSON.stringify({ content: status.post.content, images: status.post.images}) === JSON.stringify({content, images}))
   return dispatch({ type: ALERT, payload: { error: 'Data not change!' } });
   let media = []
   try {
      dispatch({ type: ALERT, payload: { loading: true } });
      if(images.length > 0) {
         for(const item of imgNewUrl) {
            if(item.camera) {
               media.push(await imageUpload(item.camera))
            } else {
               media.push(await imageUpload(item))
            }
         }
      }
      media = [...media, ...imgOldUrl];


      const res = await patchApi(`posts/${status.post._id}`, { content, images: media}, auth.access_token)

      dispatch({ type: UPDATE_POST, payload: { 
         ...status.post,
         content,
         images: media,
      } })

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
   } catch(err: any) {
      dispatch({ type: ALERT, payload: { error: err.response.data.msg }})
   }
}

export const likePost = (post: IPost,auth: IAuth, socket : Socket) => async(dispatch: Dispatch<ICommentType | IPostDiscoverType |IPostType | IAlertType>) => {
   if(!auth.user || !auth.access_token) return dispatch({ type: ALERT, payload: { error: 'Please, login to your account' } });
   const newPost: IPost = { ...post, likes: [...post?.likes, auth.user] }
   dispatch({ type: UPDATE_POST, payload: newPost })
   socket.emit('likePost', newPost)
   try {
         await patchApi(`posts/${post._id}/like`, {}, auth.access_token)


         // Notify
         const msg = {
            id: auth.user._id,
            text: 'like your post',
            recipients: [post.user],
            url: `/posts/${post._id}`,
            content: post.content,
            image: post.images[0].url
         }
         dispatch((createNotify(msg, auth, socket) as any))
         // dispatch({ type: LIKE_POST, payload: newPost })
         dispatch({ type: UPDATE_ONE_POST_DISCOVER, payload: newPost })
   } catch(err: any) {
      dispatch({ type: ALERT, payload: { error: err.response.data.msg }})
   }
}

export const unLikePost = (post: IPost,auth: IAuth, socket : Socket) => async(dispatch: Dispatch<IPostDiscoverType |IPostType | IAlertType>) => {
   if(!auth.user || !auth.access_token) return dispatch({ type: ALERT, payload: { error: 'Please, login to your account' } });
   try {
         const newPost: IPost = { ...post, likes: post.likes.filter(item => item._id !== auth.user?._id) }
         socket.emit('unLikePost', newPost)
         await patchApi(`posts/${post._id}/unlike`, {}, auth.access_token)
         // Notify
         const msg = {
            id: auth.user._id,
            text: 'like your post',
            recipients: [post.user],
            url: `/posts/${post._id}`,
         }
         dispatch((deleteNotify(msg, auth, socket) as any))
         dispatch({ type: UN_LIKE_POST, payload: newPost })
         dispatch({ type: UPDATE_ONE_POST_DISCOVER, payload: newPost })
   } catch(err: any) {
      dispatch({ type: ALERT, payload: { error: err.response.data.msg }})
   }
}

export const getDetailPost = (id: string, auth: IAuth) => async(dispatch: Dispatch<IPostDiscoverType |IPostType | IAlertType | ICommentType>) => {
   if(!auth.user || !auth.access_token) return dispatch({ type: ALERT, payload: { error: 'Please, login to your account' } });
   try {
         const res = await getApi(`posts/${id}`, auth.access_token)
         dispatch({ type: GET_DETAIL_POST, payload: res.data.post})
         
   } catch(err: any) {
      dispatch({ type: ALERT, payload: { error: err.response.data.msg }})
   }
}

export const deletePost = (post: IPost, auth: IAuth, socket: Socket) => async(dispatch: Dispatch<IPostDiscoverType |IPostType | IAlertType>) => {
   if(!auth.user ||!auth.access_token) return dispatch({ type: ALERT, payload: { error: 'Please, login to your account' } });
   try  {
      dispatch({ type: DELETE_POST, payload: post})
      const res = await deleteApi(`posts/${post._id}`, auth.access_token)

            // Notify
            const msg = {
               id: post._id,
               text: 'Added a new post',
               recipients: post.user.followers,
               url: `/posts/${post._id}`,
            }
      
            dispatch((deleteNotify(msg, auth, socket) as any))
   } catch(err: any) {
      dispatch({ type: ALERT, payload: { error: err.response.data.msg }})
   }
}

export const savePost = (post: IPost, auth: IAuth) => async(dispatch: Dispatch<IPostDiscoverType |IPostType | IAlertType | IAuthType>) => {
   if(!auth.user || ! auth.access_token) return dispatch({ type: ALERT, payload: { error: 'Please, login to your account' } });
   const newUser = {...auth.user, saved: [...auth.user?.saved, post._id]}
   dispatch({ type: AUTH, payload: {access_token: auth.access_token, user: newUser } })
   try {
      await patchApi(`save_post/${post._id}/save`, {}, auth.access_token)
   } catch(err: any) {
      dispatch({ type: ALERT, payload: { error: err.response.data.msg }})
   }
}

export const unSavePost = (post: IPost, auth: IAuth) => async(dispatch: Dispatch<IPostDiscoverType |IPostType | IAlertType | IAuthType>) => {
   if(!auth.user || ! auth.access_token) return dispatch({ type: ALERT, payload: { error: 'Please, login to your account' } });
   const newUser = {...auth.user, saved: auth.user?.saved.filter(item => item !== post._id)}
   dispatch({ type: AUTH, payload: {access_token: auth.access_token, user: newUser } })
   try {
      await patchApi(`save_post/${post._id}/unsave`, {}, auth.access_token)
   } catch(err: any) {
      dispatch({ type: ALERT, payload: { error: err.response.data.msg }})
   }
}


export const getSavePosts = (auth: IAuth) => async(dispatch: Dispatch<IPostDiscoverType |IPostType | IAlertType | IAuthType>) => {
   if(!auth.user || ! auth.access_token) return dispatch({ type: ALERT, payload: { error: 'Please, login to your account' } });
   try {
      const res = await getApi(`saved_posts`, auth.access_token)
      console.log(res)
   } catch(err: any) {
      dispatch({ type: ALERT, payload: { error: err.response.data.msg }})
   }
}