import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { IPost } from '../../utils/Typescript'
import { OPEN_MODAL_COMMENT } from '../../redux/types/commentType'


interface IProps {
   post: IPost
}
const Comment = ({ post }: IProps) => {
   const dispatch = useDispatch()
   return (
      <div className="comment">
         <div className='see_more_comments mt-2'>
            {  
               post.comments &&
               post.comments.length >= 2 &&
               <p style={{ color: '#9eb8dd', fontSize: '16px', cursor: 'pointer' }}
                  onClick={() => dispatch({ type: OPEN_MODAL_COMMENT, payload: { isOpen: true, post: post } })}
               >see all {post.comments.length} comment</p>
            }
         </div>
      </div>
   )
}

export default Comment