import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore } from '../../utils/Typescript'
import Avatar from '../Header/Avatar'
import { Link } from 'react-router-dom'
import { STATUS } from '../../redux/types/statusType'


const Status = () => {
   const { auth } = useSelector((state: RootStore) => state)
   const dispatch = useDispatch()
   return (
      <div className='status my-3 d-flex align-items-center'>
         <Link to={`profile/${auth.user?._id}`}>
            <Avatar src={(auth.user?.avatar as string)} size='big' />
         </Link>

         <div className='ml-4 thinking' onClick={() => dispatch({ type: STATUS, payload: { status: true}})}>
            <span>
               {auth.user?.fullname}, what  are you thinking?
            </span>
         </div>
      </div>
   )
}

export default Status