import React, { useEffect } from 'react'
import UserCard from '../card/UserCard'
import { useSelector, useDispatch } from 'react-redux'
import { IUser, RootStore } from '../../utils/Typescript'
import FollowBtn from '../global/FollowBtn'
import { getSuggestionUser } from '../../redux/action/suggestionUserAction'
import LoadICon from '../../images/loading.gif'
import { useNavigate } from 'react-router-dom'

const RightSideBar = () => {
   const { auth, suggestionUser } = useSelector((state: RootStore) => state)
   const dispatch = useDispatch()
   const navigate = useNavigate()
   return (
      <div className='suggestions position-fixed'>
         <UserCard user={(auth.user as IUser)} border='' />

         <div className='d-flex justify-content-between align-items-center my-2'>
            <h5 style={{ fontSize: '14px', color: '#bbbbbb', fontWeight: 'bold'}}>Suggestions for you</h5>
            <small style={{ fontSize: '12px', color: '#333', fontWeight: 'bold', cursor: 'pointer' }}
               onClick={() => navigate('/explore')}
            >See all</small>
         </div>
         
         {
            suggestionUser.load ? 
               <img src={LoadICon} className='d-block mx-auto' alt="loading" />
            :
            <div className='my-2'>
               {
                  suggestionUser.users.map(item => (
                     <UserCard key={item._id} user={(item as IUser)} border=''>
                        <FollowBtn user={item} />
                     </UserCard>
                  ))
               }
            </div>
         }
         <div className='mt-4' style={{ opacity: '0.7'}}>
            <a href="https://github.com/phanquan0712" target='_blank' rel="noreferrer">
               https://github.com/phanquan0712
            </a>

            <p style={{ fontSize: '14px'}} className='mt-2'>
               Welcome to Winter Website
            </p>

            <small>
            © 2022 WINTER FROM KARINA
            </small>
         </div>
      </div>
   )
}

export default RightSideBar