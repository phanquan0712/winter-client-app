import React, { useState } from 'react'
import { IPost } from '../../../utils/Typescript'
import Carousel from './Carousel'


interface IProps {
   post: IPost
}
const CardPostBody = ({ post }: IProps) => {
   const [readMore, setReadMore] = useState<boolean>(false)
   return (
      <div className='card_body'>
         <div className="card_body-content">
            <span>
               {
                  post.content.length < 60 ?
                  post.content
                  :
                  readMore ? post.content : post.images.length > 0 ? post.content.slice(0, 60) + '...' : post.content.slice(0, 300)
               }
               {
                  post.images.length > 0 ?
                  post.content.length > 60 &&
                  <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => setReadMore(!readMore)}>
                     {readMore ? 'Hide content' : 'Read more'}
                  </span>
                  :
                  post.content.length > 300 &&
                  <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => setReadMore(!readMore)}>
                     {readMore ? 'Hide content' : 'Read more'}
                  </span>
               }
            </span>
         </div>

         {
            post.images.length > 0 && <Carousel images={post.images} id={post._id} />
         }
      </div>
   )
}

export default CardPostBody