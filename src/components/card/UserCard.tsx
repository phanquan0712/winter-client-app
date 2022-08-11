import React from 'react'
import { IUser, RootStore } from '../../utils/Typescript'
import Avatar from '../Header/Avatar'
import { Link } from 'react-router-dom'
import { IUserMessage } from '../../redux/types/messageType'
import { useSelector, useDispatch } from 'react-redux'

interface IProps {
   user: IUserMessage
   border: string
   handleClose?: () => void
   children?: React.ReactNode
   setShowFollow?: (value: boolean) => void
   role?: boolean
}
const UserCard = ({ children, user, border, handleClose, role }: IProps) => {
   const { theme } = useSelector((state: RootStore) => state)
   const handleCloseAll = () => {
      if (handleClose) handleClose();
   }
   

   return (
      <div className={`d-flex align-items-center ${border} d-flex justify-content-between p-1 w-100`}>
         <div>
            <Link to={`/profile/${user._id}`} onClick={handleCloseAll}
               className='d-flex align-items-center p-2'
               style={{ textDecoration: 'none' }}
            >
               <Avatar src={user.avatar} size='medium' />

               <div className='ml-2' style={{ transform: 'translateY(-2px)' }}>
                  <span className="d-block">{user.username}</span>
                  <small style={{ filter: theme ? 'invert(1)' : 'invert(0)', opacity: 0.7 }}>
                     {
                        !role &&
                     <>
                        {
                           user.text || user.media ?
                              <div>
                                 {
                                    user.media &&
                                       user.media.length > 0 ?
                                       <span>Sent you {user.media.length} photos</span>
                                       :
                                       <>
                                             {
                                                user.text &&
                                                user.text?.length > 0 &&
                                                <span>{(user.text?.slice(0, 30) + '...')}</span>

                                             }
                                       </>
                                 }
                                 {
                                    user.call &&
                                    <span
                                       style={{ color: user.call.times === 0 ? '#ff0000' : 'green' }}
                                    >
                                       {
                                          user.call.times === 0 ? 
                                          user.call.video ? 'You have a missed video call' : 'You have a missed audio call'
                                          :
                                          user.call.video ? 'You just got a video call' : 'You just got a audio call'
                                       }
                                    </span>
                                 }
                              </div>
                              :
                              ''
                        }
                     </>
                     }
                  </small>
               </div>
            </Link>
         </div>
         {children}
      </div>
   )
}

export default UserCard