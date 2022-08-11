import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore, IPost, IUser, IComment, FormSubmit } from '../../utils/Typescript'
import { createComment, createAnswerComment } from '../../redux/action/commentAction'
import { OPEN_MODAL_COMMENT } from "../../redux/types/commentType";
import Icon from './Icon'
import { ANSWER_COMMENT } from '../../redux/types/commentType'

interface IProps {
   post: IPost
}

const InputComment = ({ post }: IProps) => {
   const [content, setContent] = useState<string>('')
   const { auth, comments, answerComment, socket } = useSelector((state: RootStore) => state)
   const dispatch = useDispatch()
   const handleSubmit = (e: FormSubmit) => {
      e.preventDefault()
      if (answerComment.isAnswer) {
         let newAnswerComment = {} as IComment
         if (answerComment.isAnswerCommentAnswer) {
            newAnswerComment = {
               content,
               tag: answerComment.replyComment?.user,
               reply: [],
               likes: [],
               user: (auth.user as IUser),
               createdAt: new Date().toISOString(),
            }
         } else {
            newAnswerComment = {
               content,
               tag: answerComment.comment?.user,
               reply: [],
               likes: [],
               user: (auth.user as IUser),
               createdAt: new Date().toISOString(),
            }
         }
         const newComment: IComment = {
            ...answerComment.comment,
            reply: [...(answerComment.comment.reply as IComment[]), newAnswerComment]
         }
         dispatch(createAnswerComment(post, newComment, newAnswerComment, auth, socket))
      } else {
         const newComment: IComment = {
            content,
            likes: [],
            user: (auth.user as IUser),
            reply: [],
            createdAt: new Date().toISOString(),
         }
         dispatch(createComment(post, newComment, auth, socket))
      }
      setContent('')
   }


   return (
      <div className='input_comment'>
         <form onSubmit={handleSubmit} className='d-flex align-items-center justify-content-between'>
            <div className='d-flex align-items-center'>
               <Icon content={content} setContent={setContent} />
               {
                  answerComment.isAnswer &&
                  <div className='tag_user'>
                     <span className='mr-1' style={{ fontSize: '14px' }}>@{answerComment.comment.user?.username}</span>
                     <span className='close_tag' 
                        onClick={() => dispatch({ type: ANSWER_COMMENT, payload: { isAnswer: false, isAnswerCommentAnswer: false, comment: {}, replyComment: {} } })}
                     >&times;</span>
                  </div>
               }
               <input type="text" name='comment' placeholder="Add a comment."
                  value={content}
                  onChange={(e) => setContent((e.target.value))}
               />
            </div>
            <button disabled={content ? false : true} type='submit'
               style={{ opacity: content ? 1 : 0.4, cursor: content ? 'pointer' : '' }}
            >Post</button>
         </form>
      </div>
   )
}

export default InputComment