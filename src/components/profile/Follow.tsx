import React, { useEffect, useState } from 'react'
import { IUser } from '../../utils/Typescript'
import UserCard from '../card/UserCard'
import FollowBtn from '../global/FollowBtn'
import { useSelector } from 'react-redux'
import { RootStore, MouseClick } from '../../utils/Typescript'


interface IProps {
   title?: string
   users: IUser[]
   setShowFollow: (value: boolean) => void
}
const Following = ({title, users, setShowFollow}: IProps) => {
   const { auth } = useSelector((state: RootStore) => state)
   const [userFlollow, setUserFollow] = useState<IUser[]>([])

   useEffect(() => {
      if(users.length === 0) return;
      setUserFollow(users)

      return () => setUserFollow([])
   }, [users])
   const handleClose = () => {
      setShowFollow(false)
   }
   
   const handleOverlayClick = (e: MouseClick) => {
      if(e.target === e.currentTarget) {
         handleClose()
      }
   }

   return (
      <div className='follow'  onClick={(e) => handleOverlayClick(e)}>
         <div className="follow_box">
            <h5 className="follow_title text-center" style={{ color: 'teal', letterSpacing: 2}}>{title}</h5>
            <hr />

            {
               userFlollow.length > 0 &&
               userFlollow.map(user => (
                  <UserCard
                     key={user._id}
                     user={user}
                     border=''
                     handleClose={handleClose}
                     setShowFollow={setShowFollow}
                  >
                     {
                        auth.user?._id !== user._id && <FollowBtn key={user._id} user={user} />
                     }
                  </UserCard>
               ))
            }

            <div className='close' onClick={() => setShowFollow(false)}>
               &times;
            </div>

         </div>
      </div>
   )
}

export default Following