import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { IParams, IPost, RootStore } from '../../utils/Typescript'
import { getDetailPost } from '../../redux/action/postAction'
import Carousel from '../../components/card/card_post/Carousel'
import Loading from '../../components/alert/Loading'
import CardPostHeader from '../../components/card/card_post/CardPostHeader'
import CardComment from '../../components/card/card_comment'
import CardPostFooter from '../../components/card/card_post/CardPostFooter'
import InputComment from '../../components/global/InputComment'


const DetailPost = () => {
   const { id }: IParams = useParams()
   const dispatch = useDispatch()
   const [post, setPost] = useState<IPost>()
   const { auth, detailPost } = useSelector((state: RootStore) => state)

   useEffect(() => {
      if (!id) return;
      dispatch(getDetailPost(id, auth))
   }, [id, dispatch])

   useEffect(() => {
      if (!detailPost) return;
      setPost(detailPost)
   }, [detailPost])
   if (!post) return <Loading />
   return (
      <div className='detail_post'>
         <div className="detail_post-images">
            <Carousel images={post.images} id={post._id} />
         </div>
         <div className="detail_post-content">
            <CardPostHeader post={post} />
            <div className="post-content px-3">
               {post.content}
            </div>
            <hr className='mb-0' />
            {
               post.comments &&
                  post.comments.length > 0 ?
                  <div className="list-comment pt-3 pb-3 pl-3 pr-2">
                     {
                        post.comments &&
                        post.comments.map(item => (
                           <div className="comment-item pb-2" key={item._id}>
                              {
                                 item.user &&
                                 <CardComment user={item.user} comment={item} post={post} />
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
               <CardPostFooter post={post} />
               <InputComment post={post} />
            </div>
         </div>
      </div>
   )
}

export default DetailPost