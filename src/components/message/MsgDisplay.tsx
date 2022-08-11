import React from 'react'
import { IUser } from '../../utils/Typescript'
import Avatar from '../Header/Avatar'
import { IMessage } from '../../redux/types/messageType'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore } from '../../utils/Typescript'
import { deleteMessage } from '../../redux/action/messageAction'
import Times from '../global/Times'

interface IProps {
   user: IUser
   msg: IMessage
   theme: boolean
   typeMessage: string
}

const MsgDisplay = ({ user, msg, theme, typeMessage }: IProps) => {
   const { auth, socket } = useSelector((state: RootStore) => state)
   const dispatch = useDispatch()
   const imageShow = (src: any) => {
      return (
         <img
            className='w-100 h-100 p-2 mb-1'
            src={src}
            alt="Image"
            style={{ filter: theme ? 'invert(1)' : 'invert(0)', border: '2px solid #ddd', borderRadius: '5px' }}
         />
      )
   }

   const videoShow = (src: any) => {
      return (
         <video
            className='w-100 h-100 p-2 mb-1'
            src={src}
            controls
            style={{ filter: theme ? 'invert(1)' : 'invert(0)', border: '2px solid #ddd', borderRadius: '5px' }}
         />
      )
   }

   const handleDeleteMessage = (msg: IMessage) => {
      console.log(msg);
      if(msg) {
         dispatch(deleteMessage(msg, auth, socket))
      }
   }

   return (
      <>
      {
         user._id !== auth.user?._id &&
         <div className="chat_title">
            <Avatar src={user.avatar} size='small' />
            <span>{user.username}</span>
         </div>
      }
         <div className="chat_body">
            {
               user._id === auth.user?._id &&
               <i className="fa fa-trash text-danger"
                  onClick={() => handleDeleteMessage(msg)}
               ></i>
            }


            {
               msg.call && 
               <button className='btn d-flex align-items-center py-3'
                  style={{ background: '#eee', borderRadius: '10px'}}
                  >
                     <span className='material-icons font-weight-bold mr-1'
                        style={{
                           fontSize: '2rem', color: msg.call.times === 0 ? 'crimson': 'green',
                           filter: theme ? 'invert(1)' : 'invert(0)'
                        }}
                     >
                        {
                           msg.call.times === 0 ? 
                           msg.call.video ? 'videocam_off' : 'phone_disabled'
                           :
                           msg.call.video ? 'video_camera_front' : 'call'
                        }
                     </span>
                     <div className="text-left">
                        <h6>{msg.call.video  ? 'Video Call' : 'Audio Call'}</h6>
                        <small>
                           {
                              msg.call.times > 0 ? <Times total={msg.call.times} /> : (new Date(msg.createdAt)).toLocaleString()
                           }
                        </small>
                     </div>
               </button>
            }

            {
               msg.text &&
               <div className="chat_text"
                  style={{ filter: theme ? 'invert(1)' : 'invert(0)', width: 'none' }}
               >
                  {msg.text}
               </div>
            }

            {
               msg.media && msg.media.length > 0 &&
               <div className="chat_media w-100">
                  {
                     msg.media.map((item, index) => (
                        <div className='w-100 p-2' style={{ height: '350px' }} key={item.url}>
                           {
                              item.url.match(/video/i) ?
                                 videoShow(item.url) : imageShow(item.url)
                           }
                        </div>
                     ))
                  }
               </div>
            }
         </div>

         <div className="chat_time">
            <small>
               {(new Date(msg.createdAt)).toLocaleString()}
            </small>
         </div>
      </>
   )
}

export default MsgDisplay