import React, { useState, useEffect } from 'react'
import { IUser, IComment, RootStore, FormSubmit, KeyboardClick, IPost } from '../../utils/Typescript'
import moment from 'moment'
import { Link } from 'react-router-dom'
import Avatar from '../Header/Avatar'
import LikeButton from '../global/LikeButton'
import { useSelector, useDispatch } from 'react-redux'
import { updateComment, likeComment, unLikeComment, deleteComment } from '../../redux/action/commentAction'
import { ANSWER_COMMENT } from '../../redux/types/commentType'
import ReplyComment from './ReplyComment'

interface IProps {
   user: IUser
   comment: IComment
   post: IPost
}

const CardComment = ({ user, comment, post }: IProps) => {
   const [isLike, setIsLike] = useState<boolean>(false)
   const [onEdit, setOnEdit] = useState<boolean>(false)
   const [editContent, setEditContent] = useState<string>('')
   const [isSeeAnswer, setIsSeeAnswer] = useState<boolean>(false)
   const { auth, comments, socket } = useSelector((state: RootStore) => state)
   const dispatch = useDispatch();

   useEffect(() => {
      if (comment.likes?.find(item => item._id === auth.user?._id)) {
         setIsLike(true)
      }
   }, [comment.likes, auth.user])

   const handleLike = () => {
      setIsLike(true)
      let likeArr: IUser[] = []
      if (comment.likes) likeArr = [...comment.likes]
      const newComment = {
         ...comment,
         likes: [...likeArr, auth.user]
      }
      dispatch(likeComment(post, (newComment as IComment), auth))
   }

   const handleUnlike = () => {
      setIsLike(false)
      let likeArr: IUser[] = []
      if (comment.likes) likeArr = [...comment.likes]
      const newComment = {
         ...comment,
         likes: likeArr.filter(user => user._id !== auth.user?._id)
      }
      dispatch(unLikeComment(post, (newComment as IComment), auth))
   }

   const handleEditComment = () => {
      if (onEdit && editContent) {
         const newComment = {
            ...comment,
            content: editContent
         }
         setOnEdit(false)
         setEditContent('')
         dispatch(updateComment(post, newComment, auth))
      }
   }

   const handleKeyboardEvent = (e: KeyboardClick) => {
      if (e.key === 'Enter') {
         handleEditComment()
      }
   };

   const handleAnswerComment = () => {
      if (!onEdit) {
         dispatch({ type: ANSWER_COMMENT, payload: { isAnswer: true, comment: comment } })
      }
   }

   return (
      <div className='card-comment d-flex justify-content-between'>
         <div className="d-flex w-100">
            <Link to={`profile/${user._id}`} className='mr-2'>
               <Avatar src={(user?.avatar as string)} size="medium" />
            </Link>

            <div className="card_name position-relative pr-2 w-100">
               {
                  onEdit ?
                     <textarea typeof='submit' rows={5} cols={30} value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onKeyDown={handleKeyboardEvent}
                     />
                     :
                     <div style={{
                        transform: 'translateY(3px)',
                     }} className='mb-3'>
                        <Link className='mr-2' to={`profile/${user._id}`}>
                           {user.username}
                        </Link>
                        <span style={{ fontSize: '15px', textAlign: 'start' }}>
                           {comment.content}
                        </span>
                     </div>
               }
               <div className='card-comment-footer  d-flex justify-content-start align-items-center'>
                  <small style={{ color: '#777' }} className='mr-3'>
                     {moment(comment.createdAt).fromNow()}
                  </small>
                  {
                     comment.likes &&
                     comment.likes.length > 0 &&
                     <small style={{ color: '#777', fontWeight: 'bold', cursor: 'pointer' }} className='mr-3'>
                        {comment.likes.length > 1 ? `${comment.likes.length} likes` : '1 like'}
                     </small>
                  }
                  <small style={{ color: '#777', cursor: 'pointer', fontWeight: 'bold' }}
                     onClick={handleAnswerComment}
                  >
                     Answer
                  </small>
                  {
                     auth.user?._id === user._id ?
                        <div className='nav-item dropdown more position-relative'>
                           <span className="material-icons nav-link" role="button" data-toggle="dropdown">
                              more_horiz
                           </span>
                           <div className="dropdown-menu p-0 comment-dropdown" aria-labelledby="navbarDropdown">
                              <div className='dropdown-item py-2 d-flex align-items-center' style={{ cursor: 'pointer' }}
                                 onClick={() => {
                                    setOnEdit(true)
                                    setEditContent(comment.content)
                                 }}
                              >
                                 <span className='material-icons mr-2'>create</span>
                                 Edit
                              </div>
                              <div className='dropdown-item py-2 d-flex align-items-center' style={{ cursor: 'pointer' }}
                                 onClick={() => dispatch(deleteComment(post, comment, auth, socket))}
                              >
                                 <span className='material-icons mr-2'>delete_outline</span>
                                 Delete
                              </div>
                              <div className='dropdown-item py-2' style={{ cursor: 'pointer' }}>
                                 Cancel
                              </div>
                           </div>
                        </div>
                        :
                        post.user?._id === auth.user?._id ?
                           <div className='nav-item dropdown more position-relative'>
                              <span className="material-icons nav-link" role="button" data-toggle="dropdown">
                                 more_horiz
                              </span>
                              <div className="dropdown-menu p-0 comment-dropdown" aria-labelledby="navbarDropdown">
                                 <div className='dropdown-item py-2 d-flex align-items-center' style={{ cursor: 'pointer' }}
                                    onClick={() => dispatch(deleteComment(post, comment, auth, socket))}
                                 >
                                    <span className='material-icons mr-2'>delete_outline</span>
                                    Delete
                                 </div>
                                 <div className='dropdown-item py-2' style={{ cursor: 'pointer' }}>
                                    Cancel
                                 </div>
                              </div>
                           </div>
                           :
                           ''
                  }
               </div>

               {
                  comment.reply &&
                  comment.reply?.length > 0 &&
                  <div className="list-answer">
                     <div className='w-100 d-flex align-items-center' style={{ color: 'rgb(119, 119, 119)', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                        <span style={{ background: '#999', width: '30px', height: '1px' }} className='mr-3'></span>
                        {
                           isSeeAnswer ? 
                           <span onClick={() => setIsSeeAnswer(false)}>Hide answer</span>
                           :
                           <span onClick={() => setIsSeeAnswer(true)}>See the answer ({comment.reply?.length})</span>
                        }
                     </div>
                     {
                        isSeeAnswer &&
                        comment.reply?.map(item => (
                           <ReplyComment key={item._id} answerComment={item} post={post} comment={comment} user={user} />
                        ))
                     }
                  </div>
               }

               <div className="like ml-2 position-absolute" style={{ transform: 'translateY(7px)', cursor: 'pointer', height: '30px', top: 0, right: 0 }}>
                  <LikeButton
                     isLike={isLike}
                     handleLike={handleLike}
                     handleUnlike={handleUnlike}
                  />
               </div>
            </div>
         </div>
      </div>
   )
}

export default CardComment