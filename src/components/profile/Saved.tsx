import React, { useEffect, useState } from 'react'
import { IPost } from '../../utils/Typescript'
import { RootStore } from '../../utils/Typescript'
import { useSelector, useDispatch } from 'react-redux'
import PostThumb from '../home/PostThumb'
import { IStateType } from '../../redux/types/userType'
import LoadIcon from '../../images/loading.gif'
import LoadMoreButton from '../global/LoadMoreButton'
import { getApi } from '../../utils/fetchData'
import { Dispatch } from 'redux'
import { ALERT } from '../../redux/types/alertType'


interface IProps {
   id: string
   dispatch: Dispatch
}
const Saved = ({ id, dispatch }: IProps) => {
   const { auth } = useSelector((state: RootStore) => state)
   const [savePosts, setSavePosts] = useState<IPost[]>([])
   const [total, setTotal] = useState<number>(0)
   const [page, setPage] = useState<number>(2)
   const [load, setLoad] = useState<boolean>(false)

   useEffect(() => {
      setLoad(true)
      getApi(`saved_posts`, auth.access_token)
         .then(res => {
            setSavePosts(res.data.posts);
            setTotal(res.data.total);
            setLoad(false);
         })
         .catch((err: any) => {
            dispatch({ type: 'ALERT', payload: err.response.data.msg });
         })
      return () => {
         setSavePosts([])
         setTotal(0)
         setPage(2)
         setLoad(false)
      }
   }, [auth.access_token])


   const handleLoadMore = async () => {
      setLoad(true);
      const res = await getApi(`saved_posts?limit=${(page + 1) * 9}`, auth.access_token)
      console.log(res);
      if (savePosts.length === res.data.total) {
         return setLoad(false)
      } else {
         setSavePosts(res.data.posts);
         setPage(page + 1);
         setTotal(res.data.total);
      }
      setLoad(false)
   }
   return (
      <div className='pb-3'>
         <PostThumb posts={savePosts} />

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

export default Saved