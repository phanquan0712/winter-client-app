import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { IImages, RootStore } from '../../utils/Typescript'
import CardPostHeader from '../card/card_post/CardPostHeader'
import CardPostFooter from '../card/card_post/CardPostFooter'
import InputComment from '../global/InputComment'
import CardPostBody from '../card/card_post/CardPostBody'
import Carousel from '../card/card_post/Carousel'
import CardComment from '../card/card_comment'
import { OPEN_MODAL_COMMENT } from '../../redux/types/commentType'
import { IModalComment } from '../../redux/types/commentType'


interface IProps {
   comments: IModalComment
}

const CommentDisplay = ({ comments }: IProps) => {
   // const { comments } = useSelector((state: RootStore) => state);
   const dispatch = useDispatch();

   
   return (
      <div className='comment_display'>
         <div className="comment_display-box">
            <div className="list-image">
               {
                  comments.post.images &&
                  <Carousel images={(comments.post.images as IImages[])} id={comments.post._id} />
               }
            </div>
            <div className="comment_content" >
               <CardPostHeader post={comments.post} />
               <div className="post-content px-3">
                  {comments.post.content}
               </div>
               <hr className='mb-0' />
               {
                  comments.post.comments &&
                  comments.post.comments.length > 0 ?
                     <div className="list-comment pt-3 pb-3 pl-3 pr-2">
                        {
                           comments.post.comments &&
                           comments.post.comments.map(item => (
                              <div className="comment-item pb-2" key={item._id}>
                                 {
                                    item.user &&
                                    <CardComment user={item.user} comment={item} post={comments.post}  />
                                 }
                              </div>
                           ))
                        }
                     </div>
                     :
                     <div className='d-flex align-items-center justify-content-center'
                        style={{ height: '500px', textAlign: 'center' }}
                     >
                        <div>
                           <h4>No Comment</h4>
                           <p>Start chatting.</p>
                        </div>
                     </div>
               }
               <div className='comment-footer w-100'>
                  <CardPostFooter post={comments.post} />
                  <InputComment post={comments.post} />
               </div>
            </div>
         </div>
         <button className='btn btn-danger btn_close' style={{ position: 'absolute', top: '1rem', right: '1rem' }}
            onClick={() => dispatch({ type: OPEN_MODAL_COMMENT, payload: { isOpen: false, post: {} } })}
         >
            Close
         </button>
      </div>
   )
}

export default CommentDisplay