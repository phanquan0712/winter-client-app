import React from 'react'
import LeftMess from '../../components/message/LeftMess'
const index = () => {
   return (
      <div className='message d-flex'>
         <div className="col-md-4 border-right px-0">
               <LeftMess />
         </div>
         {
            window.innerWidth > 520 &&
            <div className='col-md-8 px-0'>
               <div className='d-flex justify-content-center align-items-center flex-column h-100'>
                  <i className='fab fa-facebook-messenger text-primary'></i>
                  <h4>Message</h4>
               </div>
            </div>
         }
      </div>
   )
}

export default index