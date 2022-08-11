import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { IPost, RootStore } from './utils/Typescript'
import { UPDATE_POST } from './redux/types/postType'
import { FOLLOW } from './redux/types/userType'
import { IUser } from './utils/Typescript'
import { AUTH } from './redux/types/authType'
import { GET_NOTIFY, CREATE_NOTIFY, DELETE_NOTIFY } from './redux/types/notifyType'
import { OPEN_MODAL_COMMENT } from './redux/types/commentType'
import audiobell from './audio/client_src_audio_got-it-done-613.mp3'
import { addMessage } from './redux/action/messageAction'
import { ADD_MESSAGE, DELETE_MESSAGE, IUserMessage, ADD_USER, IMessage } from './redux/types/messageType'
import { OFFLINE, ONLINE } from './redux/types/onlineType'
import { CALL } from './redux/types/callType'
import { ALERT } from './redux/types/alertType'


const spawnNotification = (body: any, icon: any, url: any, title: any) => {
   let options = {
      body, icon
   }

   let n = new Notification(title, options)

   n.onclick = (e: any) => {
      e.preventDefault()
      window.open(url, '_blank')
   }
}

const SocketClient = () => {
   const { auth, socket, status, comments, notify, message, online } = useSelector((state: RootStore) => state);
   const dispatch = useDispatch();

   // joinUser
   useEffect(() => {
      socket.emit('joinUser', auth.user)
      return () => socket.off('joinUser')
   }, [auth.user, socket])

   // Likes
   useEffect(() => {
      socket.on('likeToClient', (data: any) => {
         dispatch({ type: UPDATE_POST, payload: data })
      })
      return () => socket.off('likeToClient')
   }, [socket, dispatch])

   // UnLike
   useEffect(() => {
      socket.on('unLikeToClient', (data: any) => {
         dispatch({ type: UPDATE_POST, payload: data })
         console.log(data);
      })
      return () => socket.off('unLikeToClient')
   }, [socket, dispatch])

   // Create Comment
   useEffect(() => {
      socket.on('createCommentToClient', (data: any) => {
         dispatch({ type: UPDATE_POST, payload: data })
      })
      return () => socket.off('createCommentToClient')
   }, [socket, dispatch])

   // Create Answer Comment
   useEffect(() => {
      socket.on('createAnswerCommentToClient', (data: any) => {
         dispatch({ type: UPDATE_POST, payload: data })
      })
      return () => socket.off('createAnswerCommentToClient')
   }, [socket, dispatch])

   // Delete Comment
   useEffect(() => {
      socket.on('deleteCommentToClient', (data: any) => {
         dispatch({ type: UPDATE_POST, payload: data })
      })
      return () => socket.off('deleteCommentToClient')
   }, [socket, dispatch])

   // Follow
   useEffect(() => {
      socket.on('followToClient', (data: any) => {
         dispatch({ type: FOLLOW, payload: (data as IUser) })
         if (auth.user)
            dispatch({
               type: AUTH,
               payload: {
                  ...auth,
                  user: data
               }
            })
      })
      return () => socket.off('followToClient')
   }, [socket, dispatch])

   // UnFollow
   useEffect(() => {
      socket.on('unFollowToClient', (data: any) => {
         dispatch({ type: FOLLOW, payload: (data as IUser) })
         if (auth.user)
            dispatch({
               type: AUTH,
               payload: {
                  ...auth,
                  user: data
               }
            })
      })
      return () => socket.off('unFollowToClient')
   }, [socket, dispatch])

   // Notification
   useEffect(() => {
      socket.on('createNotifyToClient', (data: any) => {
         dispatch({ type: CREATE_NOTIFY, payload: data })
         if (notify.sound) audioRef.current?.play()
         spawnNotification(
            data.user.username + ' ' + data.text,
            data.user.avatar,
            data.url,
            'Winter'
         )
      })
      return () => socket.off('createNotifyToClient')
   }, [socket, notify.sound, dispatch])

   useEffect(() => {
      socket.on('deleteNotifyToClient', (data: any) => {
         dispatch({ type: DELETE_NOTIFY, payload: data })
      })
      return () => socket.off('deleteNotifyToClient')
   }, [socket, dispatch])


   // Message
   useEffect(() => {
      socket.on('addMessageToClient', (data: any) => {
         console.log(data)
         dispatch({ type: ADD_MESSAGE, payload: data });
         if (message.users.every(item => item._id !== data.user?._id)) {
            dispatch({ type: ADD_USER, payload: {
               ...data.user,
               text: data.text, 
               media: data.media
            } });
         }
      })
   return () => socket.off('addMessageToClient')
}, [socket, dispatch])

   useEffect(() => {
      socket.on('deleteMessageToClient', (data: any) => {
         dispatch({ type: DELETE_MESSAGE, payload: data });
      })
      return () => socket.off('deleteMessageToClient')
   }, [socket, dispatch])

   // Check User Online / Offline
   useEffect(() => {
      socket.emit('checkUserOnline', auth.user)
   }, [socket, dispatch])

   useEffect(() => {
      socket.on('checkUserOnlineToMe', (data: any) => {
         (data as any[]).forEach(item => {
            if(!online.includes(item.id)) {
               dispatch({ type: ONLINE, payload: item.id })
            }
         });
      })
      return () => socket.off('checkUserOnlineToMe')
   }, [socket, dispatch, online])

   useEffect(() => {
      socket.on('checkUserOnlineToClient', (data: any) => {
         if(!online.includes(data)) {
            dispatch({ type: ONLINE, payload: data })
         }
      })
      return () => socket.off('checkUserOnlineToClient')
   }, [socket, dispatch, online])

   useEffect(() => {
      socket.on('checkUserOffline', (data: any) => {
            dispatch({ type: OFFLINE, payload: data })
      })
      return () => socket.off('checkUserOffline')
   }, [socket, dispatch])

   // Call User
   useEffect(() => {
      socket.on('callUserToClient', (data: any) => {
         console.log(data);
         dispatch({ type: CALL, payload: { ...data, isOpen: true} })
      })
      return () => socket.off('callUserToClient')
   }, [socket, dispatch])


   useEffect(() => {
      socket.on('UserBusy', (data: any) => {
         dispatch({ type: ALERT, payload: { error: `The ${data.username} is busy!`}})
      })
      return () => socket.off('UserBusy')
   }, [socket, dispatch])




const audioRef = useRef<HTMLAudioElement>(null)
return (
   <>
      <audio className='d-none' controls ref={audioRef}>
         <source src={audiobell} type='audio/mp3' />
      </audio>
   </>
)
}

export default SocketClient