import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore, InputChange, FormSubmit } from '../../utils/Typescript'
import { STATUS } from '../../redux/types/statusType'
import { ALERT } from '../../redux/types/alertType'
import { createPost, updatePost } from '../../redux/action/postAction'
import Icon from '../global/Icon'
import { useNavigate } from 'react-router-dom'


const StatusModal = () => {
   const { auth, theme, status, socket } = useSelector((state: RootStore) => state)
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const [content, setContent] = useState<string>('')
   const [images, setImages] = useState<any[]>([])

   const [stream, setStream] = useState<boolean>(false)
   const [track, setTrack] = useState<MediaStreamTrack>()
   const videoRef = useRef(null)
   const canvasRef = useRef(null)
   const handleChangeImages = (event: InputChange) => {
      const target = event.target as HTMLInputElement;
      const files: File[] = Array.from((target.files as FileList));
      let err: string = '';
      const newImages: File[] = [];

      files.forEach(file => {
         if (!file) return err = 'File does not exist!';
         if (file.size > 1024 * 1024 * 20) {
            return err = "The image/video largest is 20mb."
         }
         return newImages.push(file)
      })
      if (err) return dispatch({ type: ALERT, payload: { error: err } })
      setImages([...images, ...newImages])
   }


   const handleDeleteImage = (index: number) => {
      setImages(images.filter((_, i) => i !== index))
   }

   useEffect(() => {
      if (status.onEdit) {
         setContent(status.post.content)
         setImages(status.post.images)
      }
   }, [status])


   const handleStream = () => {
      setStream(true)
      if (navigator.mediaDevices) {
         navigator.mediaDevices.getUserMedia({ video: true })
            .then(mediaStream => {
               if (videoRef.current) {
                  (videoRef.current as HTMLMediaElement).srcObject = mediaStream;
                  (videoRef.current as HTMLMediaElement).play();
                  const track = mediaStream.getVideoTracks()[0];
                  setTrack(track)
               }
            }).catch(err => console.log(err))
      }
   }


   const handleStopStream = () => {
      track?.stop();
      setStream(false)
   }

   const handleCapture = () => {
      if (videoRef.current && canvasRef.current) {
         const width = (videoRef.current as HTMLMediaElement).clientWidth;
         const height = (videoRef.current as HTMLMediaElement).clientHeight;

         (canvasRef.current as HTMLCanvasElement).setAttribute('height', height + 'px');
         (canvasRef.current as HTMLCanvasElement).setAttribute('width', width + 'px');
         const ctx = (canvasRef.current as HTMLCanvasElement).getContext('2d');
         ctx?.drawImage((videoRef.current as CanvasImageSource), 0, 0, width, height);
         let URL = (canvasRef.current as HTMLCanvasElement).toDataURL('');
         console.log(typeof URL);

         setImages([...images, { camera: URL }])
      }

   }


   const handleSubmit = (e: FormSubmit) => {
      e.preventDefault()
      if (images.length === 0) return dispatch({ type: ALERT, payload: { error: 'Please upload images!' } })

      if (status.onEdit) {
         dispatch(updatePost(content, images, auth, status))
      } else {
         dispatch(createPost(content, images, auth, socket))
      }
      setContent('')
      setImages([])
      if (track) track.stop()
      dispatch({ type: STATUS, payload: false })
      return navigate('/')
   }

   const imageShow = (src: any) => {
      return (
         <img
            src={src}
            alt="Image"
            style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
         />
      )
   }

   const videoShow = (src: any) => {
      return (
         <video
            src={src}
            controls
            style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
         />
      )
   }

   const handleClose = () => {
      if(window.innerWidth > 768) {
         return () => dispatch({ type: STATUS, payload: false })
      } else  {
         return navigate('/')
      }  
   }

   return (
      <div className='status_modal'>
         <form onSubmit={handleSubmit}>
            <div className="status_box">
               <h5 className='status_box-title'>{status.onEdit ? 'Update Post' : 'Create Post'}</h5>
               <hr />

               <div className='status_box-content'>
                  <textarea
                     name='content'
                     value={content}
                     placeholder={`${auth.user?.fullname}, what are you thinking?`}
                     onChange={(e) => setContent(e.target.value)}
                  />

                  <div className="show_images my-3">
                     {
                        images.length > 0 &&
                        images.map((item, index) => (
                           <div key={index} id="file_img">
                              {
                                 item.camera ? imageShow(item.camera)
                                    : item.url ?
                                       <>
                                          {
                                             item.url.match(/video/i) ? 
                                             videoShow(item.url) : imageShow(item.url)
                                          }
                                       </>
                                       :
                                       <>
                                          {
                                             item.type.match(/video/i) ? 
                                             videoShow(URL.createObjectURL(item)) : imageShow((URL.createObjectURL(item)))
                                          }
                                       </>
                              }

                              <span className='img_close' onClick={() => handleDeleteImage(index)}>
                                 &times;
                              </span>
                           </div>
                        ))
                     }
                  </div>


                  {
                     stream &&
                     <div className="stream position-relative">
                        <video src="" autoPlay muted ref={videoRef} width="100%" height="100%"
                           style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
                        />

                        <span className='stream_close' onClick={handleStopStream}>&times;</span>
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                     </div>
                  }

                  <div className='status_box-content-image'>
                     {
                        stream ? <i className='fas fa-camera' onClick={handleCapture} />
                           :
                           <div className='d-flex align-items-center'>
                              <i className='fas fa-camera' onClick={handleStream} />
                              <div className='file_upload'>
                                 <i className='fas fa-image' style={{ transform: 'translateY(2px)' }}></i>
                                 <input type="file" name="file" id="file" multiple accept='image/*, video/*' onChange={handleChangeImages} />
                              </div>
                              <div>
                                 <Icon content={content} setContent={setContent} />
                              </div>
                           </div>
                     }
                  </div>
               </div>

               <div className="status_box-footer">
                  <button className='w-100 btn btn-dark mt-3' type='submit'>
                     Post
                  </button>
               </div>

               <div className='close' onClick={handleClose}>
                  &times;
               </div>

            </div>
         </form>
      </div>
   )
}

export default StatusModal