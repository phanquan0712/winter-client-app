import React, { useEffect, useState } from 'react'
import { IPost } from '../../utils/Typescript'
import { RootStore } from '../../utils/Typescript'
import { useSelector, useDispatch } from 'react-redux'
import PostThumb from '../home/PostThumb'
import { IStateType } from '../../redux/types/userType'
import LoadIcon from '../../images/loading.gif'
import LoadMoreButton from '../global/LoadMoreButton'
import { getApi } from '../../utils/fetchData'
import { GET_POST_USER } from '../../redux/types/userType'


interface IProps {
   profile: IStateType
   id: string
}
const Post = ({ profile, id }: IProps) => {
   const { auth } = useSelector((state: RootStore) => state)
   const [posts, setPosts] = useState<IPost[]>([])
   const [load, setLoad] = useState<boolean>(false)
   const [total, setTotal] = useState<number>(0)
   const [page, setPage] = useState<number>(2)
   const dispatch = useDispatch()
   useEffect(() => {
      if (!auth.access_token) return;
      setLoad(true)
      setPosts(profile.posts)
      setPage(profile.page ? profile.page : 2)
      setTotal(profile.total ? profile.total : 0)
      setLoad(false)
      return () => {
         setPosts([])
         setPage(2)
         setTotal(0)
      }
   }, [id, profile.posts])

   const handleLoadMore = async () => {
      setLoad(true);
      const res = await getApi(`user_posts/${id}?limit=${(page) * 9}`, auth.access_token)
      console.log(res);
      if (profile.posts?.length === res.data.posts.length) {
         setLoad(false)
      }
      dispatch({ type: GET_POST_USER, payload: { total: res.data.total, posts: (res.data.posts as IPost[]), page: page + 1, _id: id } });
      setLoad(false)
   }
   return (
      <div className='pb-3'>
         <PostThumb posts={posts} />
         {
            load && <img src={LoadIcon} className='d-block mx-auto my-4' alt="loading" />
         }
         {
            <LoadMoreButton total={total} page={page} load={load}
               hanleLoadMore={handleLoadMore} />
         }
      </div>
   )
}

export default Post