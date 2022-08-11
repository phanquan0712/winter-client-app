import React, { useEffect, useRef, useState } from 'react'
import Status from '../components/home/Status'
import Posts from '../components/home/Posts'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore } from '../utils/Typescript'
import LoadIcon from '../images/loading.gif'
import RightSideBar from '../components/home/RightSideBar'
import { getApi } from '../utils/fetchData'
import { GET_POST } from '../redux/types/postType'
import { getPost, getPostNew } from '../redux/action/postAction'
import Loading from '../components/alert/Loading'


const Home = () => {
   const { homePost, auth } = useSelector((state: RootStore) => state)
   const dispatch = useDispatch()
   const [page, setPage] = useState<number>(0)
   // const scrollEvent = async (e: any) => {
   //    const post = document.getElementById('posts')
   //    if (post) {
   //       // console.log(Math.ceil(window.scrollY + window.outerHeight - 114))
   //       // console.log(Math.ceil(post.offsetTop + post.clientHeight));

   //       if (Math.ceil(window.scrollY + window.outerHeight - 114 - 31) >= Math.ceil(post.offsetTop + post.clientHeight)) {
   //          if(auth.access_token)
   //          dispatch(getPost(auth.access_token, homePost.page + 1))
   //       }
   //    }
   // }

   // useEffect(() => {
   //    window.addEventListener('scroll', scrollEvent)
   //    return () => {
   //       window.removeEventListener('scroll', scrollEvent)
   //    }
   // }, [auth.access_token, dispatch])
   const pageEnd = useRef<HTMLButtonElement>(null)
   useEffect(() => {
      const observer = new IntersectionObserver(entries => {
         if (entries[0].isIntersecting) {
            setPage(prev => prev + 1)
         }
      }, {
         threshold: 1
      })
      if (pageEnd.current) {
         observer.observe(pageEnd.current)
      }
   }, [setPage, pageEnd.current])

   useEffect(() => {
      if (auth.access_token) {
         dispatch(getPostNew(auth.access_token, page))
      }
   }, [homePost.total, page, auth.access_token, dispatch])
   return (
      <div className='home row'>
         <div className='col-md-8'>
            {/* <Status /> */}
            <div id='posts' className='position-relative'>
               {
                  !homePost.load ?
                     (homePost.total === 0 && homePost.posts.length === 0) ?
                        <h2 className='text-center my-3'>No Post</h2>
                        :
                        <Posts posts={homePost.posts} />
                     :
                     <img src={LoadIcon} className='d-block mx-auto my-4' alt="loading" />
               }
            </div>
         </div>
         <div className="col-md-4 position-relative">
            <RightSideBar />
         </div>
         <button style={{ opacity: 0 }} ref={pageEnd}>Load more</button>
      </div>
   )
}

export default Home