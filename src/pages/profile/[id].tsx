import React, { useEffect, useState} from 'react'
import Info from '../../components/profile/Info'
import Post from '../../components/profile/Post'
import { getProfileUser } from '../../redux/action/userAction'
import { IPost, RootStore } from '../../utils/Typescript'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { IParams } from '../../utils/Typescript'
import { IStateType } from '../../redux/types/userType'
import Saved from '../../components/profile/Saved'

const Profile = () => {
   const { id }: IParams = useParams()
   const { profile, auth } = useSelector((state: RootStore) => state)
   const [selectNav, setSelectNav] = useState<string>('home')
   const dispatch = useDispatch()
   useEffect(() => {
      if(profile._id !== id) {
         dispatch(getProfileUser((id as string), auth.access_token))
      } 
      return () => setSelectNav('home')
   }, [id, dispatch, profile.users, auth.access_token])

   const profileNav = [
      {path: 'home', label: 'Post', icon: 'import_contacts'},
      {path: 'saved', label: 'Saved', icon: 'bookmark'},
      {path: 'tagged', label: 'Tagged', icon: 'tag'},
   ]

   const isActive = (path: string) => {
      return selectNav === path ? 'active' : ''
   }

   return (
      <div className='profile mt-3 container-ui'>
         <Info users={profile.users} />
         <div className='profile-nav'>
            {
               auth.user?._id === id ?
               profileNav.map(item => (
                  <div key={item.path} className={`profile-nav-item ${isActive(item.path)}`} onClick={() => setSelectNav(item.path)}>
                     <span className='material-icons'>{item.icon}</span>
                     <span>{item.label}</span>
                  </div>
               ))
               :
               profileNav.filter(item => item.path !== 'saved').map(item => (
                  <div key={item.path} className={`profile-nav-item ${isActive(item.path)}`} onClick={() => setSelectNav(item.path)}>
                     <span className='material-icons'>{item.icon}</span>
                     <span>{item.label}</span>
                  </div>
               ))
            }
         </div>
         {
            selectNav === 'home' &&
            <Post id={id as string} profile={profile}  />
         }

         {
            selectNav === 'saved' &&
            <Saved id={id as string} dispatch={dispatch} /> 
         }

         {
            selectNav === 'tagged' && 
            <div className='text-center my-3'>
               <h4>
                  There are not photos tagged yet
               </h4>
            </div>
         }
      </div>
   )
}

export default Profile