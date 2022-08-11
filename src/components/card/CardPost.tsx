import React from 'react'
import { IPost } from '../../utils/Typescript'
import CardPostHeader from './card_post/CardPostHeader'
import CardPostBody from './card_post/CardPostBody'
import CardPostFooter from './card_post/CardPostFooter'
import Comment from '../home/Comment'
import InputComment from '../global/InputComment'

interface IProps {
   post: IPost
}

const CardPost = ({ post }: IProps) => {
   return (
      <div className='card_post card my-3'>
         <CardPostHeader post={post} />
         <CardPostBody post={post} />
         <CardPostFooter post={post} />
         <Comment post={post} />
         <InputComment post={post} />
      </div>
   )
}

export default CardPost