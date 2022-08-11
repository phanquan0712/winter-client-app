import React, { useRef, useEffect, useState } from 'react'
import { getApi } from '../../utils/fetchData'
import { IPost } from '../../utils/Typescript'
import CardPost from '../card/CardPost'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore } from '../../utils/Typescript'
import LoadIcon from '../../images/loading.gif'

interface IProps {
   posts: IPost[]
}
const Posts = ({ posts }: IProps) => {
   const { auth, homePost } = useSelector((state: RootStore) => state)
   const dispatch = useDispatch()
   return (
      <div className='posts'>
         {
            posts.map(post => (
               <CardPost key={post._id} post={post} />
            ))
         }
         {
            homePost.load &&
            <img src={LoadIcon} className='d-block mx-auto my-4' alt="loading" />
         }
      </div>
   )
}

export default Posts