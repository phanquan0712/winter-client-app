import React from 'react'


interface IProps {
   total: number
   page: number
   load: boolean
   hanleLoadMore: () => void
}
const LoadMoreButton = ({ total, page, load, hanleLoadMore }: IProps) => {
   
   return (
      <>
         { total < 9 * (page - 1) ? '' : 
            !load &&
            <button className='btn btn-dark load_more mx-auto d-block mt-3'
               onClick={hanleLoadMore}
            >Load more</button>
         }
      </>
   )
}

export default LoadMoreButton