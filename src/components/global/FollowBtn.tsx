import React, { useEffect, useState } from 'react'
import { IUser } from '../../utils/Typescript'
import { RootStore } from '../../utils/Typescript'
import { useDispatch, useSelector } from 'react-redux'
import { follow, unfollow } from '../../redux/action/userAction'

interface IProps {
   user: IUser
}

const FollowBtn = ({ user }: IProps) => {
   const [followed, setFollowed] = useState<boolean>(false)
   const dispatch = useDispatch()
   const { auth, profile, socket } = useSelector((state: RootStore) => state)

   useEffect(() => {
      if(auth.user?.following.find(item => item._id === user._id)) {
         setFollowed(true)
      }
      return () => setFollowed(false)
   }, [auth.user?.following, user])

   const hanleFollow = () => {
      setFollowed(true)
      console.log(user);
      
      dispatch(follow(profile.users, user, auth, socket))
   }

   const handleUnFollow = () => {
      setFollowed(false)
      dispatch(unfollow(profile.users, user, auth, socket))
   }


   return (
      <>
         {
            followed ?
               <button className="btn btn-outline-danger"
                  onClick={handleUnFollow}
               >
                  UnFollow
               </button>
               :
               <button className="btn btn-outline-info"
                  onClick={hanleFollow}
               >
                  Follow
               </button>
         }
      </>
   )
}

export default FollowBtn