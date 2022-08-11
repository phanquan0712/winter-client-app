import React from 'react'
import { IPost } from '../../../utils/Typescript'
import Avatar from '../../Header/Avatar'
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore } from '../../../utils/Typescript'
import { STATUS } from '../../../redux/types/statusType'
import { deletePost } from '../../../redux/action/postAction'

interface IProps {
   post: IPost
}
const CardPostHeader = ({ post }: IProps) => {
   const navigate = useNavigate()
   const { auth, socket } = useSelector((state: RootStore) => state)
   const dispatch = useDispatch()

   const handleEditPost = () => {
      console.log(post);
      dispatch({ type: STATUS, payload: { post, onEdit: true, status: true}})
   }

   const handleDeletePost =  () => {
      if(window.confirm('Are you sure to delete this post?')) {
         dispatch(deletePost(post, auth, socket))
         return navigate('/')
      }
   }

   const handleCopyLink = () => {
      navigator.clipboard.writeText(`${window.location.origin}/posts/${post._id}`)
   }

   return (
      <div className='card_header'>
         <div className="d-flex align-items-center">
            <Link to={`profile/${post.user?._id}`} className='mr-2'>
               <Avatar src={(post.user?.avatar as string)} size="medium" />
            </Link>

            <div className="card_name">
               <h6>
                  <Link to={`profile/${post.user?._id}`}>
                     {post.user?.fullname}
                  </Link>
               </h6>
               <small style={{ color: '#999'}}>
                  {moment(post.createdAt).fromNow()}
               </small>
            </div>
         </div>
         <div className='nav-item dropdown'>
            <span className="material-icons nav-link" role="button" data-toggle="dropdown">
               more_horiz
            </span>
            <div className="dropdown-menu p-0" aria-labelledby="navbarDropdown">
               {
                  auth.user?._id === post.user?._id &&
                  <>
                     <div className='dropdown-item py-2' onClick={handleEditPost}>
                        <span className='material-icons mr-2'>create</span>
                        Edit
                     </div>
                     <div className='dropdown-item py-2' onClick={handleDeletePost}>
                        <span className='material-icons mr-2'>delete_outline</span>
                        Delete
                     </div>
                  </>
               }
               <div className='dropdown-item py-2' onClick={handleCopyLink}>
                  <span className='material-icons mr-2'>content_copy</span>
                  Copy Link
               </div>
            </div>
         </div>
      </div>
   )
}

export default CardPostHeader