import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IParams, IUser } from '../../utils/Typescript'
import { useDispatch, useSelector } from 'react-redux'
import { RootStore } from '../../utils/Typescript'
import NotFound from '../global/NotFound'
import Avatar from '../Header/Avatar'
import ProfileEdit from '../profile/ProfileEdit'
import FollowBtn from '../global/FollowBtn'
import Follow from './Follow'


interface IProps {
   users: IUser[]
}
const Info = ({ users }: IProps) => {
   const { id }: IParams = useParams()
   const { auth } = useSelector((state: RootStore) => state)
   const dispatch = useDispatch()

   const [userData, setUserData] = useState<IUser[]>([])
   const [onEdit, setOnEdit] = useState<boolean>(false)

   const [showFollowers, setShowFollowers] = useState<boolean>(false)
   const [showFollowing, setShowFollowing] = useState<boolean>(false)

   useEffect(() => {
      if (!id || !auth.user || !auth.access_token) return;
      else if (id === auth.user?._id) {
         setUserData([auth.user])
      }
      else {
         const newData = users.filter(item => item._id === id)
         
         setUserData(newData)
      }
   }, [id, auth, users])

   return (
      <div className='info'>
         {
            userData.map(user => (
               <div className="info_container" key={user._id}>
                  <div className='mb-2'>
                     <Avatar src={userData && typeof (user.avatar) === 'string' ? user.avatar : ''} size='super' />
                  </div>

                  <div className="info_content">
                     <div className="info_content_title">
                        <h2>{user.username}</h2>
                        {
                           user._id === auth.user?._id ?
                              <button className='btn btn-outline-info'
                                 onClick={() => setOnEdit(true)}
                              >Edit Profile</button>
                              :
                              <FollowBtn key={user._id} user={user} />
                        }
                     </div>

                     <div className='p-2 mb-3' style={{ border: '1px solid orange' }}>

                        <div className='follow_btn mb-2'>
                           <span className='mr-4' onClick={() => setShowFollowing(true)}>
                              {user.following?.length > 0 ? user.following?.length : 0} Following
                           </span>
                           <span className='ml-4' onClick={() => setShowFollowers(true)}>
                              {user.followers?.length > 0 ? user.followers?.length : 0} Followers
                           </span>
                        </div>

                        <h6 className='m-0 mb-2'>
                           <span>
                              <strong style={{ color: 'orange' }} className='mr-2'>Full name:</strong>
                              {user.fullname}
                           </span>

                        </h6>

                        <h6 className='m-0 mb-2'>
                           <span>
                              <strong style={{ color: 'orange' }} className='mr-2'>Mobile:</strong>
                              {user.mobile}
                           </span>
                        </h6>

                        <h6 className='m-0 mb-2'>
                           <span>
                              <strong style={{ color: 'orange' }} className='mr-2'>Address:</strong>
                              {user.address}
                           </span>
                        </h6>

                        <h6 className='m-0 mb-2'>
                           <span>
                              <strong style={{ color: 'orange' }} className='mr-2'>Email:</strong>
                              {user.email}
                           </span>
                        </h6>

                        <h6 className='m-0 mb-2'>
                           <span>
                              <strong style={{ color: 'orange' }} className='mr-2'>Website:</strong>
                              <a href={user.website} target="_blank" rel='noreferrer'>
                                 {user.website}
                              </a>
                           </span>
                        </h6>

                     </div>

                     <div>
                        <h6 className='m-0 mb-2 text-center'>
                           <span className='text-center w-100'>
                              <strong style={{ color: 'teal' }} className='mr-2'>Story</strong>
                           </span>
                        </h6>
                        <p className="p-3" style={{ border: '1px solid teal' }}>{user.story ? user.story : 'None'}</p>
                     </div>
                  </div>

                  {
                     onEdit && <ProfileEdit user={user} setOnEdit={setOnEdit} />
                  }
                  
                  {
                     showFollowers && 
                     <Follow users={user.followers} title='Followers' setShowFollow={setShowFollowers} />
                  }
                  
                  {
                     showFollowing && 
                     <Follow users={user.following} title='Following' setShowFollow={setShowFollowing} />
                  }

               </div>
            ))
         }
      </div>
   )
}

export default Info