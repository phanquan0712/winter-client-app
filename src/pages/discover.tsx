import React, { useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore } from '../utils/Typescript'
import { getPostDiscover } from '../redux/action/discoverAction'
import PostThumb from '../components/home/PostThumb'
import LoadIcon from '../images/loading.gif'
import LoadMoreButton from '../components/global/LoadMoreButton'
import { getApi } from '../utils/fetchData'
import { UPDATE_POSTS_DISCOVER } from '../redux/types/discoverType'



const Discover = () => {
   const { auth, discoverPost } = useSelector((state: RootStore) => state)
   const dispatch = useDispatch()
   const [load, setLoad] = useState<boolean>(false)
   useEffect(() => {
      if(!auth.access_token) return;
      dispatch(getPostDiscover(auth.access_token))
      console.log(discoverPost);
      
   }, [dispatch, auth.access_token])
   
   
   const handleLoadMore = async() => {
      setLoad(true)
      const res = await getApi(`post_discover?limit=${discoverPost.page * 3}`, auth.access_token)
      if(discoverPost.posts.length === res.data.total) {
         setLoad(false)
      }
      dispatch({ type: UPDATE_POSTS_DISCOVER, payload: res.data})
      setLoad(false)
   }

   return (
      <div className='pb-3'>
         {
            discoverPost.loading 
            ? <img src={LoadIcon} className='d-block mx-auto my-4' alt="loading" />
            :
            <PostThumb posts={discoverPost.posts} />
         }
         {
            load && <img src={LoadIcon} className='d-block mx-auto my-4' alt="loading" />
         }
         {
            !discoverPost.loading && 
            <LoadMoreButton total={discoverPost.total} page={discoverPost.page} load={load}
            hanleLoadMore={handleLoadMore} />
         }
      </div>
   )
}

export default Discover