import { GET_POST } from './../types/postType';
import { postAPi, patchApi, deleteApi } from './../../utils/fetchData';
import { ICommentType, OPEN_MODAL_COMMENT } from "../types/commentType";
import { Dispatch } from "react";
import { ALERT, IAlertType } from "../types/alertType";
import { IAuth } from "../types/authType";
import { IPost, IComment, IUser } from "../../utils/Typescript";
import { UPDATE_POST, IPostType, GET_DETAIL_POST } from "../types/postType";
import { UPDATE_ONE_POST_DISCOVER, IPostDiscoverType } from "../types/discoverType";
import { Socket } from 'socket.io-client';
import { createNotify } from './notifyAction';

export const createComment = (post: IPost, comment: IComment, auth: IAuth, socket: Socket) => async (dispatch: Dispatch<IAlertType | ICommentType | IPostType |IPostDiscoverType >) => {
   if (!auth.access_token || !auth.user) return dispatch({ type: ALERT, payload: { error: 'You must be logged in to comment' } });
   
   try {
      const res = await postAPi('comment', {
         postId: post._id,
         content: comment.content,
         tag: comment.tag,
      }, auth.access_token);
      console.log(res);
      
      if(res.data.msg) {
         dispatch({ type: ALERT, payload: { error: res.data.msg } })
      }
      let CommentPost: IComment[] = []
      if (post.comments) CommentPost = [...post.comments]
      const newData = {...res.data.newComment, user: auth.user}
      const newPost = { ...post, comments: [...CommentPost, newData] };


      // Socket
      socket.emit('createComment', newPost)

      // Notify
      const msg = {
         id: res.data.newComment._id,
         text: 'has commented on your post',
         recipients: [post.user],
         url: `/posts/${post._id}`,
         content: post.content,
         image: post.images[0].url
      }

      dispatch((createNotify(msg, auth, socket) as any))

      dispatch({ type: UPDATE_POST, payload: newPost });
      dispatch({ type: GET_DETAIL_POST, payload: newPost})
      dispatch({ type: UPDATE_ONE_POST_DISCOVER, payload: newPost})

   } catch (err: any) {
      return dispatch({ type: ALERT, payload: { error: err.message } });
   }
}

export const updateComment = (post: IPost, comment: IComment, auth: IAuth) => async (dispatch: Dispatch<IAlertType | ICommentType | IPostType |IPostDiscoverType>) => {
   if (!auth.access_token || !auth.user) return dispatch({ type: ALERT, payload: { error: 'You must be logged in to comment' } });
   try {
      let CommentPost: IComment[] = []
      if (post.comments) CommentPost = [...post.comments]
      CommentPost = CommentPost.map(item => (
         item._id === comment._id ? comment : item
      ))
      dispatch({ type: UPDATE_POST, payload: {...post, comments: CommentPost} });
      dispatch({ type: UPDATE_ONE_POST_DISCOVER, payload: {...post, comments: CommentPost} })
      const res = await patchApi(`comment/${comment._id}`, { content: comment.content }, auth.access_token);
      dispatch({ type: ALERT, payload: { success: res.data.msg}})
   } catch(err: any) {
      return dispatch({ type: ALERT, payload: { error: err.message } });
   }
}

export const likeComment = (post: IPost, comment: IComment, auth: IAuth) => async (dispatch: Dispatch<IAlertType | ICommentType | IPostType |IPostDiscoverType>) => {
   if (!auth.access_token || !auth.user) return dispatch({ type: ALERT, payload: { error: 'You must be logged in to comment' } });
   try {
      let CommentPost: IComment[] = []
      if (post.comments) CommentPost = [...post.comments]
      CommentPost = CommentPost.map(item => (
         item._id === comment._id ? comment : item
      ))
      await patchApi(`comment/${comment._id}/like`, { }, auth.access_token);
      dispatch({ type: UPDATE_POST, payload: {...post, comments: CommentPost} });
      dispatch({ type: UPDATE_ONE_POST_DISCOVER, payload: {...post, comments: CommentPost} })
   } catch(err: any) {
      return dispatch({ type: ALERT, payload: { error: err.message } });
   }
}

export const unLikeComment = (post: IPost, comment: IComment, auth: IAuth) => async (dispatch: Dispatch<IAlertType | ICommentType | IPostType | IPostDiscoverType>) => {
   if (!auth.access_token || !auth.user) return dispatch({ type: ALERT, payload: { error: 'You must be logged in to comment' } });
   try {
      let CommentPost: IComment[] = []
      if (post.comments) CommentPost = [...post.comments]
      CommentPost = CommentPost.map(item => (
         item._id === comment._id ? comment : item
      ))
      await patchApi(`comment/${comment._id}/unlike`, { }, auth.access_token);
      dispatch({ type: UPDATE_POST, payload: {...post, comments: CommentPost} });
      dispatch({ type: UPDATE_ONE_POST_DISCOVER, payload: {...post, comments: CommentPost} })
   } catch(err: any) {
      return dispatch({ type: ALERT, payload: { error: err.message } });
   }
}


export const deleteComment = (post: IPost, comment: IComment, auth: IAuth, socket: Socket) => async (dispatch: Dispatch<IAlertType | ICommentType | IPostType |IPostDiscoverType>) => {
   if (!auth.access_token || !auth.user) return dispatch({ type: ALERT, payload: { error: 'You must be logged in to comment' } });
   try {
      let CommentPost: IComment[] = []
      if (post.comments) CommentPost = [...post.comments]
      CommentPost = CommentPost.filter(item => item._id !== comment._id)
      
      // Socket
      socket.emit('deleteComment', {...post, comments: CommentPost} )

      dispatch({ type: UPDATE_POST, payload: {...post, comments: CommentPost} });
      dispatch({ type: UPDATE_ONE_POST_DISCOVER, payload: {...post, comments: CommentPost} })
      await deleteApi(`comment/${comment._id}`, auth.access_token);
   } catch(err: any) {
      return dispatch({ type: ALERT, payload: { error: err.message } });
   }
}


export const createAnswerComment = (post: IPost, comment: IComment, answerComment: IComment, auth: IAuth, socket: Socket) => async (dispatch: Dispatch<IPostDiscoverType | IAlertType | ICommentType | IPostType>) => {
   if (!auth.access_token || !auth.user) return dispatch({ type: ALERT, payload: { error: 'You must be logged in to comment' } });
   try {
      const res = await postAPi(`comment/${comment._id}/answer`, {
         postId: post._id,
         content: answerComment.content,
         tag: answerComment.tag,
      }, auth.access_token)
      let CommentPost: IComment[] = []
      if (post.comments) CommentPost = [...post.comments]
      CommentPost = CommentPost.map(item => (
         item._id === comment._id ? {...item, reply: [...(item.reply as IComment[]), {...res.data.newComment, user: auth.user}]} : item
      ))
      const newData = {...post, comments: CommentPost}

      // Socket
      socket.emit('createAnswerComment', newData)

      // Notify
      const msg = {
         id: res.data.newComment._id,
         text: 'mentioned you in a comment',
         recipients: [post.user],
         url: `/posts/${post._id}`,
         content: post.content,
         image: post.images[0].url
      }

      dispatch((createNotify(msg, auth, socket) as any))

      dispatch({ type: UPDATE_POST, payload: newData });
      dispatch({ type: UPDATE_ONE_POST_DISCOVER, payload: newData })
   } catch (err: any) {
      return dispatch({ type: ALERT, payload: { error: err.message } });
   }
}

export const updateAnswerComment = (post: IPost, comment: IComment, answerComment: IComment, auth: IAuth) => async (dispatch: Dispatch<IPostDiscoverType | IAlertType | ICommentType | IPostType>) => {
   if (!auth.access_token || !auth.user) return dispatch({ type: ALERT, payload: { error: 'You must be logged in to comment' } });
   try {
      let CommentPost: IComment[] = []
      if (post.comments) CommentPost = [...post.comments]
      CommentPost = CommentPost.map(item => (
         item._id === comment._id ?
         {
            ...item,
            reply: (item.reply as IComment[]).map(item => (
               item._id === answerComment._id ? answerComment : item
            ))
         }
         :
         item
      ))
      dispatch({ type: UPDATE_POST, payload: {...post, comments: CommentPost} });
      dispatch({ type: UPDATE_ONE_POST_DISCOVER, payload: {...post, comments: CommentPost} })

      const res = await patchApi(`comment/${answerComment._id}`, { content: answerComment.content }, auth.access_token);
      dispatch({ type: ALERT, payload: { success: res.data.msg}})
   } catch(err: any) {
      return dispatch({ type: ALERT, payload: { error: err.message } });
   }
}

export const likeAnswerComment = (post: IPost, comment: IComment, answerComment: IComment, auth: IAuth) => async (dispatch: Dispatch<IPostDiscoverType | IAlertType | ICommentType | IPostType>) => {
   if (!auth.access_token || !auth.user) return dispatch({ type: ALERT, payload: { error: 'You must be logged in to comment' } });
   try {
      let CommentPost: IComment[] = []
      if (post.comments) CommentPost = [...post.comments]
      CommentPost = CommentPost.map(item => (
         item._id === comment._id ? 
         {
            ...item, 
            reply: (item.reply as IComment[]).map(item => (
               item._id === answerComment._id ? answerComment : item
            ))
         }
         :
         item
      ))
      dispatch({ type: UPDATE_POST, payload: {...post, comments: CommentPost} });
      dispatch({ type: UPDATE_ONE_POST_DISCOVER, payload: {...post, comments: CommentPost} })
      await patchApi(`comment/${answerComment._id}/like`, { }, auth.access_token);
   } catch(err: any) {
      return dispatch({ type: ALERT, payload: { error: err.message } });
   }
}

export const unLikeAnswerComment = (post: IPost, comment: IComment, answerComment: IComment, auth: IAuth) => async (dispatch: Dispatch<IPostDiscoverType | IAlertType | ICommentType | IPostType>) => {
   if (!auth.access_token || !auth.user) return dispatch({ type: ALERT, payload: { error: 'You must be logged in to comment' } });
   try {
      let CommentPost: IComment[] = []
      if (post.comments) CommentPost = [...post.comments]
      CommentPost = CommentPost.map(item => (
         item._id === comment._id ? 
         {
            ...item, 
            reply: (item.reply as IComment[]).map(item => (
               item._id === answerComment._id ? answerComment : item
            ))
         }
         :
         item
      ))
      dispatch({ type: UPDATE_POST, payload: {...post, comments: CommentPost} });
      dispatch({ type: UPDATE_ONE_POST_DISCOVER, payload: {...post, comments: CommentPost} })
      await patchApi(`comment/${answerComment._id}/unlike`, { }, auth.access_token);
   } catch(err: any) {
      return dispatch({ type: ALERT, payload: { error: err.message } });
   }
}

export const deleteAnswerComment = (post: IPost, comment: IComment, answerComment: IComment, auth: IAuth) => async (dispatch: Dispatch<IPostDiscoverType | IAlertType | ICommentType | IPostType>) => {
   if (!auth.access_token || !auth.user) return dispatch({ type: ALERT, payload: { error: 'You must be logged in to comment' } });
   try {
      let CommentPost: IComment[] = []
      if (post.comments) CommentPost = [...post.comments]
      CommentPost = CommentPost.map(item => (
         item._id === comment._id ? 
         {
            ...item,
            reply: (item.reply as IComment[]).filter(item => item._id !== answerComment._id)
         }
         :item
      ))
      dispatch({ type: UPDATE_POST, payload: {...post, comments: CommentPost} });
      dispatch({ type: UPDATE_ONE_POST_DISCOVER, payload: {...post, comments: CommentPost} })
      await deleteApi(`comment/${answerComment._id}`, auth.access_token);
   } catch(err: any) {
      return dispatch({ type: ALERT, payload: { error: err.message } });
   }
}