import React, { useState, useEffect } from 'react'
import { IUser, IComment, RootStore, FormSubmit, KeyboardClick, IPost } from '../../utils/Typescript'
import moment from 'moment'
import { Link } from 'react-router-dom'
import Avatar from '../Header/Avatar'
import LikeButton from '../global/LikeButton'
import { useSelector, useDispatch } from 'react-redux'
import { updateAnswerComment, likeAnswerComment, unLikeAnswerComment, deleteAnswerComment } from '../../redux/action/commentAction'
import { ANSWER_COMMENT } from '../../redux/types/commentType'
import { OPEN_MODAL_COMMENT } from '../../redux/types/commentType'  

interface IProps {
   user: IUser
   comment: IComment
   answerComment: IComment
   post: IPost
}

const ReplyComment = ({ user, comment, answerComment, post }: IProps) => {
   const [isLike, setIsLike] = useState<boolean>(false)
   const [onEdit, setOnEdit] = useState<boolean>(false)
   const [editContent, setEditContent] = useState<string>('')
   const { auth, comments } = useSelector((state: RootStore) => state)
   const dispatch = useDispatch();

   useEffect(() => {
      if (answerComment.likes?.find(item => item._id === auth.user?._id)) {
         setIsLike(true)
      }
   }, [answerComment.likes, auth.user])

   const handleLike = () => {
      setIsLike(true)
      let likeArr: IUser[] = []
      if (answerComment.likes) likeArr = [...answerComment.likes]
      const newComment = {
         ...answerComment,
         likes: [...likeArr, auth.user]
      }
      dispatch(likeAnswerComment(post,comment, (newComment as IComment), auth))
   }

   const handleUnlike = () => {
      setIsLike(false)
      let likeArr: IUser[] = []
      if (answerComment.likes) likeArr = [...answerComment.likes]
      const newComment = {
         ...answerComment,
         likes: likeArr.filter(user => user._id !== auth.user?._id)
      }
      dispatch(unLikeAnswerComment(post,comment, (newComment as IComment), auth))
   }

   const handleEditComment = () => {
      if (onEdit && editContent) {
         const newComment = {
            ...answerComment,
            content: editContent
         }
         setOnEdit(false)
         setEditContent('')
         dispatch(updateAnswerComment(post,comment, newComment, auth))
      }
   }

   const handleKeyboardEvent = (e: KeyboardClick) => {
      if (e.key === 'Enter') {
         handleEditComment()
      }
   };

   const handleAnswerComment = () => {
      if(!onEdit) {
         dispatch({ type: ANSWER_COMMENT, payload: { isAnswer: true, isAnswerCommentAnswer: true, comment: comment, replyComment: answerComment } })
      }
   }

   return (
      <div className='card-comment d-flex justify-content-between w-100'>
         <div className="d-flex w-100">
            <Link to={`profile/${answerComment.user?._id}`} className='mr-2'>
               <Avatar src={(answerComment.user?.avatar as string)} size="medium" />
            </Link>

            <div className="card_name position-relative w-100">
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
                        <Link className='mr-2' to={`profile/${answerComment.user?._id}`} 
                           onClick={() => dispatch({ type: OPEN_MODAL_COMMENT, payload: { isOpen: false, post: {}, onEdit: false }})}
                        >
                           {answerComment.user?.username}
                        </Link>
                        <span style={{ fontSize: '15px', textAlign: 'start' }}>
                           <span style={{ color:  'blue', fontSize: '14px'}} className='mr-1'>@{answerComment.tag?.username}</span>
                           <span>{answerComment.content}</span>
                        </span>
                     </div>
               }
               <div className='card-comment-footer  d-flex justify-content-start align-items-center'>
                  <small style={{ color: '#777' }} className='mr-3'>
                     {moment(answerComment.createdAt).fromNow()}
                  </small>
                  {
                     answerComment.likes &&
                     answerComment.likes.length > 0 &&
                     <small style={{ color: '#777', fontWeight: 'bold', cursor: 'pointer' }} className='mr-3'>
                        {answerComment.likes.length > 1 ? `${answerComment.likes.length} likes` : '1 like'}
                     </small>
                  }
                  <small style={{ color: '#777', cursor: 'pointer', fontWeight: 'bold' }}
                     onClick={handleAnswerComment}
                  >
                     Answer
                  </small>
                  {
                     auth.user?._id === answerComment.user?._id ?
                        <div className='nav-item dropdown more position-relative'>
                           <span className="material-icons nav-link" role="button" data-toggle="dropdown">
                              more_horiz
                           </span>
                           <div className="dropdown-menu p-0 comment-dropdown" aria-labelledby="navbarDropdown">
                              <div className='dropdown-item py-2 d-flex align-items-center' style={{ cursor: 'pointer' }}
                                 onClick={() => {
                                    setOnEdit(true)
                                    setEditContent(answerComment.content)
                                 }}
                              >
                                 <span className='material-icons mr-2'>create</span>
                                 Edit
                              </div>
                              <div className='dropdown-item py-2 d-flex align-items-center' style={{ cursor: 'pointer' }}
                                 onClick={() => dispatch(deleteAnswerComment(post,comment, answerComment, auth))}
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
                                    onClick={() => dispatch(deleteAnswerComment(post, comment, answerComment, auth))}
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

               <div className="like ml-2 position-absolute" style={{ transform: 'translateY(7px)', cursor: 'pointer', height: '30px', top: 0, right: '-8px' }}>
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

export default ReplyComment