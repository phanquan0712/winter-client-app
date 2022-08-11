import React, { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootStore } from '../../../utils/Typescript'
import { IImages } from '../../../utils/Typescript'

interface IProps {
   images: any[]
   id: string
}

const Carousel = ({ images, id }: IProps) => {
   const { theme } = useSelector((state: RootStore) => state)
   const isActive = (index: number) => {
      if (index === 0) return 'active'
      else  return ''
   }
   const videoStop = useRef<HTMLDivElement>(null)
   // useEffect(() => {
   //    const videoActive = videoStop.current?.classList.contains('active')
   //    if(!videoActive) {
   //       const video = videoStop.current?.querySelector('video') as HTMLVideoElement
   //       if(video) {
   //          video.pause()
   //       }
   //    }
   // }, [videoStop.current?.classList])
   return (
      <div id={`image${id}`} className="carousel slide" data-ride="carousel">
         <ol className="carousel-indicators">
            {
               (images as IImages[]) && (images as IImages[]).length > 0 &&
               (images as IImages[]).map((_, index) => (
                  <li key={index} data-target={`#image${id}`} data-slide-to={index} className={isActive(index)}></li>
               ))
            }
         </ol>
         <div className="carousel-inner">
            {
               (images as IImages[]) && (images as IImages[]).length > 0 &&
               (images as IImages[]).map((item, index) => (
                  <div className={`carousel-item ${isActive(index)} bg-light`} key={index} ref={videoStop}>
                     {
                        item.url.match(/video/i) ?
                           <video  controls src={item.url} className="d-block w-100 h-100" style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} 
                           />
                           :
                           <img src={item.url} className="d-block w-100" style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} alt="..." 
                     />
                     }
                  </div>
               ))
            }
         </div>

         {
            (images as IImages[]) &&
            (images as IImages[]).length > 1 &&
            <>
               <a className="carousel-control-prev" href={`#image${id}`} role="button" data-slide="prev" style={{ width: '5%', height: '85%' }}>
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="sr-only">Previous</span>
               </a>
               <a className="carousel-control-next" href={`#image${id}`} role="button" data-slide="next" style={{ width: '5%',  height: '85%'  }}>
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="sr-only">Next</span>
               </a>
            </>
         }

      </div>
   )
}

export default Carousel