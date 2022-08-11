import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore } from '../../utils/Typescript'
import Notice from '../../images/notice.png'
import { INotify } from '../../redux/types/notifyType'
import { Link } from 'react-router-dom'
import Avatar from '../Header/Avatar'
import FollowBtn from './FollowBtn'
import moment from 'moment'
import { isReadNotify, deleteAllNotify } from '../../redux/action/notifyAction'
import { UPDATE_SOUND } from '../../redux/types/notifyType'


interface IProps {
   data: INotify[]
   sound: boolean
}

const NotifyModal = ( { data, sound } : IProps ) => {
   const { auth, theme } = useSelector((state: RootStore) => state)
   const dispatch = useDispatch()
   const handleIsRead = (item: INotify) => {
      dispatch(isReadNotify(item, auth))      
   }

   const handleSoundEnablel = () => {
      dispatch({ type: UPDATE_SOUND, payload: true})
      if(localStorage.getItem('sound') === 'false') {
         localStorage.removeItem('sound')
      }
      localStorage.setItem('sound', 'true')
   }

   const handleSoundDisable = () => {
      dispatch({ type: UPDATE_SOUND, payload: false})
      if(localStorage.getItem('sound') === 'true') {
         localStorage.removeItem('sound')
      }
      localStorage.setItem('sound', 'false')
   }

   
   useEffect(() => {
         const sound = localStorage.getItem('sound')
         if(sound === 'true') {
            dispatch({ type: UPDATE_SOUND, payload: true})
         }
   }, [localStorage.getItem('sound')])

   
   const handleDeleteAllNotify = () => {
      if(window.confirm(`You have ${data.length} unread notices. Are you sure to delete all?`)) {
         dispatch(deleteAllNotify(auth))
      } else return;
   }


   const imageShow = (src: any) => {
      return (
         <img
            src={src}
            alt="Image"
            style={{ filter: theme ? 'invert(1)' : 'invert(0)', width: '50px', height: '50px' }}
         />
      )
   }

   const videoShow = (src: any) => {
      return (
         <video
            src={src}
            className='bg-dark'
            style={{ filter: theme ? 'invert(1)' : 'invert(0)', width: '50px', height: '50px' }}
         />
      )
   }
   

   return (
      <div style={{ minWidth: '500px' }} className='notify'>
         <div className='d-flex justify-content-between align-items-center px-2' style={{ borderBottom: '1px solid #ccc' }}>
            <h3 style={{ fontSize: '20px' }}>Notification</h3>
            {
               sound ?
                  <i className='fas fa-bell text-danger' style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={handleSoundDisable}></i>
                  :
                  <i className='fas fa-bell-slash text-danger' style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={handleSoundEnablel}></i>
            }
         </div>

         {
            data.length === 0 &&
            <img src={Notice} alt="Notice" className='d-block m-auto' />
         }

         <div style={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }} className='mt-2'>
            {
               data.map((item: INotify) => (
                  <div key={item._id} className='px-2 mb-3'>
                     <Link to={`${item.url}`} className='d-flex text-dark align-items-center'
                        style={{ textDecoration: 'none' }}
                        onClick={() => handleIsRead(item)}
                     >
                        {
                           item.user &&
                           <Avatar src={item.user.avatar} size='big' />
                        }

                        <div className='d-flex justify-content-center align-items-center flex-fill'>
                           <div className='mx-1 flex-fill'
                              style={{}}
                           >
                              <div>
                                 <strong className='mr-1'>{item.user?.username}</strong>
                                 <span>{item.text}</span>
                              </div>
                              <small className={item.isRead ? '' : 'text-primary'}>
                                 {moment(item.createdAt).fromNow()}
                              </small>
                           </div>

                           <div className='d-flex align-items-center' style={{ gap: '10px'}}>
                              <div className='text-right'>
                                 {
                                    item.image?.match(/video/i) ? 
                                       videoShow(item.image):  imageShow(item.image)
                                 }
                              </div>
                              {
                                 !item.isRead && <i className='fas fa-circle text-primary'></i>
                              }
                           </div>
                        </div>

                     </Link>
                  </div>
               ))
            }
         </div>
         <hr className='mb-2' />
         <div 
            onClick={handleDeleteAllNotify}
         className='text-right text-danger mr-2 my-1' style={{ cursor: 'pointer'}}>
            Delete all
         </div>
      </div>
   )
}

export default NotifyModal