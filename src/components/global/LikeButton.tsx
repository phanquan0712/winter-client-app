import React from 'react'


interface IProps {
   isLike: boolean
   handleLike: () => void
   handleUnlike: () => void
}
const LikeButton = ({ isLike, handleLike, handleUnlike }: IProps) => {
   return (
      <>
         {
            !isLike ? <i className="far fa-heart mr-3" onClick={handleLike}></i>
               :
               <i className="fas fa-heart mr-3" style={{ color: '#ed4956' }} onClick={handleUnlike}></i>
         }
      </>
   )
}

export default LikeButton