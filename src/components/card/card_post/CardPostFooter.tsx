import React, { useState, useEffect } from 'react'
import { IPost, RootStore } from '../../../utils/Typescript'
import Send from '../../../images/send.svg'
import LikeButton from '../../global/LikeButton'
import { likePost, savePost, unLikePost, unSavePost } from '../../../redux/action/postAction'
import { useSelector, useDispatch } from 'react-redux'
import { OPEN_MODAL_COMMENT } from '../../../redux/types/commentType'
import { useNavigate } from 'react-router-dom'
import ShareModal from '../../global/ShareModal'
import Follow from '../../profile/Follow'
import { useParams } from 'react-router-dom'

interface IProps {
   post: IPost
}
const CardPostFooter = ({ post }: IProps) => {
   const [isLike, setIsLike] = useState<boolean>(false)
   const [isShare, setIsShare] = useState<boolean>(false)
   const [isSave, setIsSave] = useState<boolean>(false)
   const [isShowLike, setIsShowLike] = useState<boolean>(false)
   const { auth, theme, socket } = useSelector((state: RootStore) => state)
   const dispatch = useDispatch();
   const navigate = useNavigate()
   const { page } = useParams()
   useEffect(() => {
      if (auth) {
         if (post.likes?.find(item => item._id === auth.user?._id)) {
            setIsLike(true)
         }
      }
   }, [auth.user, post.likes])

   const handleLike = () => {
      setIsLike(true)
      dispatch(likePost(post, auth, socket))
   }

   const handleUnlike = () => {
      setIsLike(false)
      dispatch(unLikePost(post, auth, socket))
   }

   useEffect(() => {
      if(auth.user?.saved.find(item => item === post._id)) {
         setIsSave(true)
      } else {
         setIsSave(false)
      }
   }, [auth.user?.saved, post._id])


   const handleModalDetail = () => {
      if(!page) {
         dispatch({ type: OPEN_MODAL_COMMENT, payload: { isOpen: true, post } })
      }
   }

   return (
      <div className='card_footer'
         style={{ background: '#fff', transition: '0.2s ease'}}
      >
         <div className="card_icon_name">
            <div>
               <LikeButton
                  isLike={isLike}
                  handleLike={handleLike}
                  handleUnlike={handleUnlike}
               />

               <i className='far fa-comment mx-3' onClick={handleModalDetail}></i>

               <img src={Send} alt="Send" onClick={() => setIsShare(!isShare)}
                  style={{ opacity: isShare ? 0.5 : 1 }}
               />
            </div>
            {
               isSave ?
                  <i className="fas fa-bookmark text-info" onClick={() => dispatch(unSavePost(post, auth))}></i>

                  :
                  <i className='far fa-bookmark' onClick={() => dispatch(savePost(post, auth))}></i>
            }
         </div>
         {
            post.likes?.length > 0 &&
            <div className='likes' style={{ cursor: 'pointer' }} onClick={() => setIsShowLike(true)}>
               <strong>
                  {post.likes?.length === 1 ? '1 person like' : `${post.likes?.length} likes`}
               </strong>
            </div>
         }

         {
            isShare &&
            <ShareModal url={`${window.location.origin}/posts/${post._id}`} theme={theme} />
         }

         {
            isShowLike &&
            <Follow users={post.likes} title='Likes' setShowFollow={setIsShowLike} />
         }

      </div>
   )
}

export default CardPostFooter