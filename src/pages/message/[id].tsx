import React, { useEffect } from 'react'
import LeftMess from '../../components/message/LeftMess'
import RightMess from '../../components/message/RightMess'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore } from '../../utils/Typescript'
import { IMessage } from '../../redux/types/messageType'


const Convertsation = () => {
   const { message } = useSelector((state: RootStore) => state)
   const navigate = useNavigate()

   useEffect(() => {
      if(message.users.length ===0) {
         return navigate('/message')
      }
   }, [message.users])

   return (
      <div className='message d-flex' style={{ background: '#f1f1f1' }}>
         {
            window.innerWidth > 520 &&
            <div className="col-md-4 border-right px-0">
               <LeftMess />
            </div>
         }

         <div className='col-md-8 px-0'>
            <RightMess >
            <i className="fas fa-caret-left p-2" style={{ fontSize: '18px'}}
               onClick={() => navigate('/message')}
            ></i>
            </RightMess>
         </div>
      </div>
   )
}

export default Convertsation