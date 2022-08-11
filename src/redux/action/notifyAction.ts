import { getApi, patchApi } from './../../utils/fetchData';
import { Dispatch } from 'react';
import { Socket } from 'socket.io-client';
import { IAuth } from '../types/authType';
import { CREATE_NOTIFY, UPDATE_NOTIFY, INotify, INotifyType, GET_NOTIFY, DELETE_ALL_NOTIFY } from './../types/notifyType';
import { ALERT, IAlertType } from './../types/alertType';
import { deleteApi, postAPi } from '../../utils/fetchData';


export const createNotify = (notify: INotify, auth: IAuth, socket: Socket) => async(dispatch: Dispatch<INotifyType | IAlertType>) => {
   if(!auth.access_token || !auth.user) return dispatch({ type: ALERT, payload: { error: "Please login to create a post" } });
   try {
      const res = await postAPi('notify', notify, auth.access_token)
      socket.emit('createNotify', {
         ...res.data.notify,
         user: auth.user
      })
   } catch(err: any) {
      dispatch({ type: ALERT, payload: { error: err.response.data.msg }})
   }
}

export const deleteNotify = (notify: INotify, auth: IAuth, socket: Socket) => async(dispatch: Dispatch<INotifyType | IAlertType>) => {
   if(!auth.access_token || !auth.user) return dispatch({ type: ALERT, payload: { error: "Please login to create a post" } });
   try {
      await deleteApi(`notify/${notify.id}?url=${notify.url}`, auth.access_token)
      socket.emit('deleteNotify', notify)
   } catch(err: any) {
      dispatch({ type: ALERT, payload: { error: err.response.data.msg }})
   }
}


export const getNotifies = (token: string) => async(dispatch: Dispatch<INotifyType | IAlertType>) => {
   try {
      const res = await getApi('notify', token)
      dispatch({ type: GET_NOTIFY, payload: res.data.notifies})
   } catch(err: any) {
      return dispatch({ type: ALERT, payload: { error: err.response.data.msg }})
   }
}

export const isReadNotify = (item: INotify, auth: IAuth) => async(dispatch: Dispatch<INotifyType | IAlertType>) => {
   try {
      dispatch({ type: UPDATE_NOTIFY, payload: { ...item, isRead: true }})
      await patchApi(`isReadNotify/${item._id}`, {}, auth.access_token)
   } catch(err: any) {
      return dispatch({ type: ALERT, payload: { error: err.response.data.msg }})
   }
}

export const deleteAllNotify = (auth: IAuth) => async(dispatch: Dispatch<INotifyType | IAlertType>) => {
   try {
      dispatch({ type: DELETE_ALL_NOTIFY, payload: {}})
      await deleteApi('deleteAllNotfies', auth.access_token)
   } catch(err: any) {
      return dispatch({ type: ALERT, payload: { error: err.response.data.msg }})
   }
}