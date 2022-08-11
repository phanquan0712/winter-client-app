import { GET_POSTS_DISCOVER_LOADING, GET_POSTS_DISCOVER, UPDATE_POSTS_DISCOVER, IPostDiscoverType } from "../types/discoverType";
import { ALERT, IAlertType } from "../types/alertType";
import { Dispatch } from "react";
import { getApi } from "../../utils/fetchData";


export const getPostDiscover = (token: string) => async(dispatch: Dispatch<IAlertType | IPostDiscoverType>) => {
   if(!token) return dispatch({ type: ALERT, payload: { loading: true }})
   try {
      dispatch({ type: GET_POSTS_DISCOVER_LOADING, payload: true})
      const res = await getApi('post_discover', token)
      
      dispatch({ type: GET_POSTS_DISCOVER, payload: res.data})

      dispatch({ type: GET_POSTS_DISCOVER_LOADING, payload: false})

   } catch(err: any) {
      return dispatch({ type: ALERT, payload: { error: err.message } });
   }
}