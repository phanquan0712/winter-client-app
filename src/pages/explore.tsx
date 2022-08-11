import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getSuggestionUser } from '../redux/action/suggestionUserAction'
import { RootStore } from '../utils/Typescript'
import { Link } from 'react-router-dom'
import loadIcon from '../images/loading.gif'
import Avatar from '../components/Header/Avatar'
import FolowBtn from '../components/global/FollowBtn'


const Explore = () => {
   const { auth, suggestionUser } = useSelector((state: RootStore) => state)
   const dispatch = useDispatch()
   return (
      <div className='explore'>
         <h6 className='pl-3'>Suggestions</h6>
         {
            suggestionUser.load ?
               <img src={loadIcon} className='d-block mx-auto' alt="Loading..." />
               :
               <div className='suggestion_user'>
                  {
                     suggestionUser.users.map(item => (

                        <div className={`d-flex align-items-center justify-content-between p-1 suggestion_user_item px-2`}>
                           <div>
                              <Link to={`/profile/${item._id}`}
                                 className='d-flex align-items-center p-2'
                                 style={{ textDecoration: 'none' }}
                              >
                                 <Avatar src={item.avatar} size='medium' />

                                 <div className='ml-2' style={{ transform: 'translateY(-2px)' }}>
                                    <span className="d-block">{item.username}</span>
                                    <small style={{ opacity: 0.7 }}>{item.fullname}</small>
                                 </div>
                              </Link>
                           </div>
                           <div className='d-block'>
                              <FolowBtn user={item} />
                           </div>
                        </div>
                     ))
                  }
               </div>
         }

         <div className='mt-4 text-center' style={{ opacity: '0.7' }}>
            <a href="https://github.com/phanquan0712" target='_blank' rel="noreferrer">
               https://github.com/phanquan0712
            </a>

            <p style={{ fontSize: '14px' }} className='mt-2'>
               Welcome to Winter Website
            </p>

            <small>
               © 2022 WINTER FROM KARINA
            </small>
         </div>
      </div>
   )
}

export default Explore