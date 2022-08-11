import React from 'react'
import { IPost} from '../../utils/Typescript'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore } from '../../utils/Typescript'
import { OPEN_MODAL_COMMENT } from '../../redux/types/commentType'
import { useNavigate } from 'react-router-dom'

interface IProps {
   posts: IPost[]
}

const PostThumb = ({ posts }: IProps) => {
   const { theme } = useSelector((state: RootStore) => state)
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const imageShow = (src: any) => {
      return (
         <img
            src={src}
            alt="Image"
            style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
         />
      )
   }

   const videoShow = (src: any) => {
      return (
         <video
            src={src}
            className='h-100 w-100'
            style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
         />
      )
   }
   return (
      <div className='post_thumb'>
         {
            posts.map(post => (
                  <div key={post._id} className="post_thumb-display">
                     {
                        post.images[0]?.url.match(/video/i) ? 
                           videoShow(post.images[0].url) : imageShow(post.images[0].url)
                     }

                     <div className='post_thumb-menu' onClick={() => navigate(`/posts/${post._id}`)}>
                        <i className='far fa-heart'>{post.likes.length}</i>
                        <i className='far fa-comment'>{post.comments?.length}</i>
                     </div>
                  </div>
            ))
         }
      </div>
   )
}

export default PostThumb