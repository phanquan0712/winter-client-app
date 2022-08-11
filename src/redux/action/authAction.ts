import { IAuthType , AUTH} from './../types/authType';
import { ILoginUser, IRegisterUser } from '../../utils/Typescript';
import { Dispatch } from 'react';
import { ALERT, IAlertType } from '../types/alertType';
import { postAPi } from '../../utils/fetchData';
import { ValidRegister } from '../../utils/valid';

export const login = (data: ILoginUser)=> {
   return async(dispatch: Dispatch<IAuthType | IAlertType>) => {
      try {
         dispatch({ type: ALERT, payload: { loading: true}})
         const res = await postAPi('login', data);
         dispatch({ type: AUTH, payload: {
            access_token: res.data.access_token,
            user: res.data.user
         }})
         dispatch({ type: ALERT, payload: { success: 'Login Successfully'}})
         localStorage.setItem('logged', 'winter')

      } catch(err: any) {
         dispatch({ type: ALERT, payload: {  error: err.response.data.msg}})
      }
   }
}

export const refreshToken = () => {
   return async(dispatch: Dispatch<IAlertType | IAuthType>) => { 
      const logged = localStorage.getItem('logged');
      if(logged) {
         dispatch({ type: ALERT, payload: { loading: true}})
         try {
            const res = await postAPi('refresh_token');
            dispatch({ type: AUTH, payload: {
               access_token: res.data.access_token,
               user: res.data.user 
            }})
            dispatch({ type: ALERT, payload: {}})
         } catch(err: any) {
            dispatch({ type: ALERT, payload: {  error: err.response.data.msg}})
         }
      }
   }
}

export const register = (data: IRegisterUser) => {
   return async(dispatch: Dispatch<IAlertType>) => {
      const check = ValidRegister(data);
      if(check.errLength > 0) {         
         return dispatch({ type: ALERT, payload: { error: check.errMsg}})
      }
      try {
         dispatch({ type: ALERT, payload: { loading: true}})

         const res = await postAPi('register', data);

         dispatch({ type: ALERT, payload: { success: res.data.msg}})

      } catch(err: any) {
         dispatch({ type: ALERT, payload: {  error: err.response.data.msg}})
      }
   }
}


export const logout = () => {
   return async(dispatch: Dispatch<IAlertType>) => {
      try {
         localStorage.removeItem('logged');
         await postAPi('logout');
         window.location.href = '/';
      } catch(err: any) {
         dispatch({ type: ALERT, payload: {  error: err.response.data.msg}})
      }
   }
}