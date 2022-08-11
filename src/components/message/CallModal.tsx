import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addMessage } from '../../redux/action/messageAction'
import { CALL, ICall } from '../../redux/types/callType'
import { RootStore } from '../../utils/Typescript'
import Avatar from '../Header/Avatar'
import { ALERT } from '../../redux/types/alertType'
import { IMessage } from '../../redux/types/messageType'
import RingRing from '../../audio/RingRing.mp3'

const CallModal = () => {
   const { call, auth, socket, peer, theme } = useSelector((state: RootStore) => state)
   const dispatch = useDispatch()
   const [hour, setHour] = useState<number>(0)
   const [mins, setMins] = useState<number>(0)
   const [second, setSecond] = useState<number>(0)
   const [total, setTotal] = useState<number>(0)
   const [answer, setAnswer] = useState<boolean>(false)
   const [track, setTrack] = useState<MediaStreamTrack[]>()
   const [newCall, setNewCall] = useState<any>()
   const youVideo = useRef<HTMLVideoElement>(null)
   const otherVideo = useRef<HTMLVideoElement>(null)


   useEffect(() => {
      const setTime = () => {
         setTotal(prev => prev + 1);
         setTimeout(setTime, 1000)
      }
      setTime()

      return () => {
         setTotal(0)
      }
   }, [])

   useEffect(() => {
      setSecond(total % 60);
      setMins(parseInt((total / 60).toString()));
      setHour(parseInt((total / 3600).toString()));
   }, [total])



   // Stream Media
   const openStream = (video: boolean) => {
      const config = { audio: true, video }
      return navigator.mediaDevices.getUserMedia(config)
   }

   const playStream = (tag: any, stream: any) => {
      let video = tag;
      video.srcObject = stream;
      video.play()
   }


   
   // Answer Call
   const handleAnswer = () => {
      openStream(call.video).then((stream: any) => {
         playStream(youVideo.current, stream)
         const track = stream.getTracks();
         setTrack(track);
         const newCall = peer.call(call.peer, stream);
         newCall.on('stream', function (remoteStream: any) {
            playStream(otherVideo.current, remoteStream)
         });
      })
      setAnswer(true)
      setNewCall(newCall)
   }



   useEffect(() => {
      peer.on('call', (newCall: any) => {
         openStream(call.video).then((stream: any) => {
            if (youVideo.current) {
               playStream(youVideo.current, stream)
            }
            const track = stream.getTracks();
            setTrack(track);
            newCall.answer(stream);
            newCall.on('stream', function (remoteStream: any) {
               if (otherVideo.current) {
                  playStream(otherVideo.current, remoteStream)
               }
            });
            setAnswer(true)
            setNewCall(newCall)
         })
      })
      return () => peer.removeListener('call')
   }, [peer, call.video])


   
   useEffect(() => {
      socket.on('callerDisconnect', (data: any) => {
         dispatch({ type: CALL, payload: { isOpen: false} })
         if(newCall) newCall.close()
         let times = answer ? total : 0;
         addCallMessage(call, times)
         dispatch({ type: ALERT, payload: { error: `The ${call.username} is disconnected!`}})
      })
      return () => socket.off('callerDisconnect')
   }, [socket, answer])


   const handleEndCall = () => {
      if (track) {
         track.forEach(track => track.stop())
      }
      let times = answer ? total : 0
      if(newCall) newCall.close()
      addCallMessage(call, times);
      if (call.isOpen) {
         socket.emit('endCall', {...call, times})
      }
      dispatch({ type: CALL, payload: { isOpen: false } })
   }

   const addCallMessage = useCallback((call: ICall, times: number) => {
      const msg = {
         sender: call.sender,
         recipient: call.recipient,
         text: '', 
         media: [],
         call: {video: call.video, times},
         createdAt: new Date().toISOString()
      }
      dispatch(addMessage(msg, auth, socket))
   }, [dispatch, auth, socket, call])

   useEffect(() => {
      if (answer) {
         setTotal(0)
      } else {
         const timer = setTimeout(() => {
            if (track) {
               track.forEach(track => track.stop())
            }
            addCallMessage(call, 0)
            socket.emit('endCall', {...call, times: 0})
            dispatch({ type: CALL, payload: { isOpen: false } })
         }, 15000)
         return () => clearTimeout(timer)
      }
   }, [dispatch, answer, track, call, socket])


   useEffect(() => {
      socket.on('endCallToClient', (data: any) => {
         dispatch({ type: CALL, payload: {  isOpen: false} })
         if(newCall) newCall.close()
         const msg = {
            sender: data.sender,
            recipient: data.recipient,
            text: '', 
            media: [],
            call: {video: data.video, times: data.times ? data.times : 0},
            createdAt: new Date().toISOString()
         }
         dispatch(addMessage(msg as IMessage, auth, socket))
      })
      return () => socket.off('endCallToClient')
   }, [socket, dispatch])


   // Play - Pause Audio
   const playAudio = (newAudio: any) => {
      newAudio.play()
   }

   const pauseAudio = (newAudio: any) => {
      newAudio.pause()
      newAudio.currentTime = 0;
   }

   useEffect(() => {
      let newAudio = new Audio(RingRing)
      if(answer) {
         pauseAudio(newAudio)
      } else {
         playAudio(newAudio)
      }
      return () => pauseAudio(newAudio)
   }, [answer])

   return (
      <div className='call_modal'>
         <div className="call_box"
            style={{ display: (call.video && answer) ? 'none' : '' }}
         >
            <div className='mb-4'>
               <Avatar src={call.avatar} size='super' />
               <h4 className='pt-2'>{call.username}</h4>
               <h6 style={{ color: '#555', fontWeight: '400' }}>{call.fullname}</h6>

               {
                  answer ?
                     <div>
                        <span>{hour.toString().length < 2 ? '0' + hour : hour}</span>
                        <span>:</span>
                        <span>{mins.toString().length < 2 ? '0' + mins : mins}</span>
                        <span>:</span>
                        <span>{second.toString().length < 2 ? '0' + second : second}</span>
                     </div>
                     :
                     <div>
                        {
                           call.video ?
                              <span>Calling video...</span>
                              :
                              <span>Calling Audio...</span>
                        }
                     </div>
               }
            </div>
            {
               !answer &&
               <div className="timer py-2">
                  <small>{hour.toString().length < 2 ? '0' + hour : hour}</small>
                  <small>:</small>
                  <small>{mins.toString().length < 2 ? '0' + mins : mins}</small>
                  <small>:</small>
                  <small>{second.toString().length < 2 ? '0' + second : second}</small>
               </div>
            }

            <div className="call_menu">
               <span className='material-icons text-danger'
                  onClick={handleEndCall}
               >call_end</span>


               {
                  (call.recipient === auth.user?._id && !answer) &&
                  <>
                     {
                        call.video ?
                           <span className='material-icons text-success'
                              onClick={handleAnswer}
                           >videocam</span>
                           :
                           <span className='material-icons text-success'
                              onClick={handleAnswer}
                           >call</span>
                     }
                  </>
               }

            </div>


         </div>
         <div className="show_video" style={{
            opacity: (answer && call.video) ? '1' : '0',
            filter: theme ? 'invert(1)' : 'invert(0)'
         }}>
            <video ref={youVideo} className='you_video'></video>
            <video ref={otherVideo} className='other_video'></video>

            {
               (call.video && answer) &&
               <>
                  <div className='time_video'>
                     <span>{hour.toString().length < 2 ? '0' + hour : hour}</span>
                     <span>:</span>
                     <span>{mins.toString().length < 2 ? '0' + mins : mins}</span>
                     <span>:</span>
                     <span>{second.toString().length < 2 ? '0' + second : second}</span>
                  </div>

                  <span className='material-icons text-danger end_call'
                     onClick={handleEndCall}
                  >call_end</span>
               </>
            }
         </div>

      </div>
   )
}

export default CallModal