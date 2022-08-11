import React, { useEffect, useState, useRef } from 'react'
import UserCard from '../card/UserCard'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore, IUser, FormSubmit, InputChange } from '../../utils/Typescript'
import { useParams, useNavigate } from 'react-router-dom'
import MsgDisplay from './MsgDisplay'
import LoadICon from '../../images/loading.gif'
import Icon from '../global/Icon'
import { ALERT } from '../../redux/types/alertType'
import { imageUpload } from '../../utils/imageUpload'
import { addMessage, getMessages, deleteConversation } from '../../redux/action/messageAction'
import { GET_MESSAGES, IMessage } from '../../redux/types/messageType'
import { CALL } from '../../redux/types/callType'

interface IProps {
   children?: React.ReactNode;

}
const RightMess = ({ children }: IProps) => {
   const { auth, message, theme, socket, peer } = useSelector((state: RootStore) => state);
   const dispatch = useDispatch();
   const navigate = useNavigate()
   const { id } = useParams();
   const [user, setUser] = useState<IUser>()
   const [text, setText] = useState<string>('')
   const [media, setMedia] = useState<any[]>([])
   const [loadMedia, setLoadMedia] = useState<boolean>(false)
   const [page, setPage] = useState<number>(0)
   useEffect(() => {
      const newUser = message.users.find(item => item._id === id);
      if (newUser) setUser(newUser)
   }, [message.users, id])



   const handleChangeImages = (event: InputChange) => {
      const target = event.target as HTMLInputElement;
      const files: File[] = Array.from((target.files as FileList));
      let err: string = '';
      const newImages: File[] = [];

      files.forEach(file => {
         if (!file) return err = 'File does not exist!';
         if (file.size > 1024 * 1024 * 20) {
            return err = "The image/video largest is 20mb."
         }
         return newImages.push(file)
      })
      if (err) return dispatch({ type: ALERT, payload: { error: err } })
      setMedia([...media, ...newImages])
   }

   const imageShow = (src: any) => {
      return (
         <img
            src={src}
            alt="Image"
            style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
         />
      )
   }

   const videoShow = (src: any) => {
      return (
         <video
            src={src}
            controls
            style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
         />
      )
   }

   const handleDeleteMedia = (index: number) => {
      setMedia(media.filter((_, i) => i !== index))
   }

   const handleSubmit = async (e: FormSubmit) => {
      e.preventDefault();
      if (!text.trim() && media.length === 0) return;
      setLoadMedia(true)

      let newMediaArr = [];
      if (media.length > 0) {
         for (let i = 0; i < media.length; i++) {
            newMediaArr.push(await imageUpload(media[i]))
         }
      }

      const msg = {
         sender: auth.user?._id,
         recipient: id,
         text,
         media: newMediaArr,
         createdAt: new Date().toISOString()
      }
      setText('')
      setMedia([])
      dispatch(addMessage(msg as IMessage, auth, socket))
      if (refDisplay.current) {
         refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
      setLoadMedia(false)
   }

   const handleMessageLike = () => {
      const msg = {
         sender: auth.user?._id,
         recipient: id,
         text: '❤️',
         createdAt: new Date().toISOString()
      }
      dispatch(addMessage(msg as IMessage, auth, socket))
      if (refDisplay.current) {
         refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
   }



   useEffect(() => {
      if (id) {
         dispatch({ type: GET_MESSAGES, payload: { data: [] } })
         dispatch(getMessages(id, auth))
         setPage(1)
         if (refDisplay.current) {
            refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
         }
      }
   }, [auth, dispatch, id])

   const refDisplay = useRef<HTMLDivElement>(null)
   const pageEnd = useRef<HTMLButtonElement>(null)


   // Load more
   useEffect(() => {
      const observer = new IntersectionObserver(entries => {
         if (entries[0].isIntersecting) {
            setPage(prev => prev + 1)
         }
      }, {
         threshold: 0.1
      })
      if (pageEnd.current) {
         observer.observe(pageEnd.current)
      }
   }, [setPage, pageEnd.current])

   useEffect(() => {
      if (message.totalData >= (page - 1) * 9 && page > 1) {
         if (id) {
            dispatch(getMessages(id, auth, page))
         }
      }
   }, [message.totalData, page, id, dispatch, auth])

   useEffect(() => {
      if (refDisplay.current) {
         refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
   }, [refDisplay.current])


   const handleDeleteConversation = () => {
      window.confirm('Are you sure you want to delete this conversation?') && dispatch(deleteConversation(id as string, auth))
      return navigate('/message')
   }

   const caller = (video: boolean) => {
      if (!user) return;
      const { _id, avatar, username, fullname } = user;

      const msg = {
         sender: auth.user?._id,
         recipient: _id,
         avatar, username, fullname, video
      }
      dispatch({ type: CALL, payload: { ...msg, isOpen: true} })
   }

   const callUser = (video: boolean) => {
      if(!auth.user) return;
      const { _id, avatar, username, fullname } = auth.user;  
      const msg = {
         sender: _id,
         recipient: user?._id,
         avatar, username, fullname, video,
         peer: ''
      }
      if(peer.open) msg.peer = peer._id
      socket.emit('callUser', msg)
   }

   const handleAudioCall = () => {
      caller(false)
      callUser(false)
   }

   const handleVideoCall = () => {
      caller(true)
      callUser(true)
   }

   if (!user) return <img src={LoadICon} alt='Loading' className='d-block mx-auto my-2' />
   return (
      <>
         <div className='message_header d-flex align-items-center'>
            {
               user &&
               <>
                  {children}
                  <div style={{ flex: 1 }}>
                     <UserCard user={user} border='boder' role={true}>
                        <div className='d-flex align-items-center' style={{ gap: '25px' }}>
                           <i className='fas fa-phone-alt'
                              style={{ cursor: 'pointer' }}
                              onClick={handleAudioCall}
                           ></i>
                           <i className='fas fa-video'
                              style={{ cursor: 'pointer' }}
                              onClick={handleVideoCall}
                           ></i>
                           <i className='fas fa-trash text-danger'
                              style={{ cursor: 'pointer' }}
                              onClick={handleDeleteConversation}
                           ></i>

                        </div>
                     </UserCard>
                  </div>
               </>
            }
         </div>
         <div className="chat_container" id='messages'
            style={{ height: media.length > 0 ? 'calc(100% - 210px)' : '' }}
         >
            <div className="chat_display" ref={refDisplay}>
               <button style={{ marginTop: '-25px', opacity: 0 }} ref={pageEnd} >Load more</button>
               {
                  message.data.map((item, index) => (
                     <div key={item._id}>
                        {
                           item.sender !== auth.user?._id &&
                           <div className="chat_row other_message">
                              <MsgDisplay user={user} msg={item} theme={theme} typeMessage={'other_message'} />
                           </div>
                        }

                        {
                           item.sender === auth.user?._id &&
                           <div className="chat_row you_message">
                              <MsgDisplay user={auth.user} msg={item} theme={theme} typeMessage={'you_message'} />
                           </div>
                        }
                     </div>
                  ))
               }
               {
                  loadMedia &&
                  <div className='chat_row you_message'>
                     <img src={LoadICon} alt="Loading" />
                  </div>
               }
            </div>
         </div>

         <div className="show_media" style={{ display: media.length > 0 ? 'grid' : 'none' }}>
            {
               media.map((item, index) => (
                  <div id='file_media' key={index}>
                     {
                        item.type.match(/video/i) ?
                           videoShow(URL.createObjectURL(item))
                           :
                           imageShow(URL.createObjectURL(item))
                     }
                     <span className='close_media'
                        style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
                        onClick={() => handleDeleteMedia(index)}>&times;</span>
                  </div>
               ))
            }
         </div>

         <form className="chat_input" onSubmit={handleSubmit}>
            <Icon content={text} setContent={setText} />
            <input type="text" placeholder='Messenger...'
               value={text} onChange={(e) => setText(e.target.value)}
            />
            <div className='d-flex align-items-center' style={{ gap: '15px' }}>
               <div className='file_upload'>
                  <i className='fas fa-image'></i>
                  <input type="file" name="file" id="file" multiple accept='image/*, video/*' onChange={handleChangeImages} />
               </div>
               <i className="far fa-heart"
                  onClick={handleMessageLike}
               ></i>
            </div>
            <button type="submit" className='d-none'>Send</button>
         </form>
      </>
   )
}

export default RightMess