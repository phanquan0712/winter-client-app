import React from 'react'
import { useDispatch } from 'react-redux'
import { ALERT } from '../../redux/types/alertType'

interface IProps {
   title: string
   body: string | string[]
   bgColor: string
}

const Toast = ({title, body, bgColor}: IProps) => {
   const dispatch = useDispatch()
   const handleClose = () => {
      dispatch({ type: ALERT, payload: {}})
   }

   return (
      <div className={`toast show position-fixed text-light ${bgColor}`}
         style={{
            top: '5px', right: '5px', minWidth: '200px', zIndex: 999
         }}
      >
         <div className={`toast-header text-light ${bgColor}`} style ={{
            padding:' 0.5rem 0.75rem',
            color: '#6c757d',
            backgroundColor: 'rgba(255,255,255,.85)'
         }} >
            <strong className='mr-auto text-light'>{title}</strong>
            <button
               className='ml-2 mb-1 close'
               onClick={handleClose}
               >&times;</button>
         </div>
         <div className="toast-body">
            {
               typeof(body) === 'string' ?
               body
               :
               <ul>
                  {
                     body.map(item => (
                        <li key={item}>{item}</li>
                     ))
                  }
               </ul>
            }
         </div>
      </div>
   )
}

export default Toast