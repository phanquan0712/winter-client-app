import React from 'react'
import { useSelector } from 'react-redux'
import { RootStore } from '../../utils/Typescript'
import Loading from './Loading'
import Toast from './Toast'
const Alert = () => {
   const { alert } = useSelector((state: RootStore) => state)
   
   return (
      <div>
         { alert.loading && <Loading />}

         { alert.error && <Toast 
               title='Error!'
               body={alert.error}
               bgColor='bg-danger'
         /> }

         { alert.success && <Toast
               title='Success!'
               body={alert.success}
               bgColor='bg-success'
         /> }

      </div>
   )
}

export default Alert