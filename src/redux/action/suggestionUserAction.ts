import { IAlertType, ALERT } from './../types/alertType';
import { LOADING_SUGGESTION, GET_SUGGESTION_USER , ISuggestionUserType  } from "../types/suggestionUserType";
import { IUser } from "../../utils/Typescript";
import { Dispatch} from "react";
import { getApi } from '../../utils/fetchData';

export const getSuggestionUser = (token: string) => async(dispatch: Dispatch<ISuggestionUserType | IAlertType>) => {
   try {
      dispatch({ type: LOADING_SUGGESTION, payload: true })

      const res = await getApi('suggestion_user', token);
      dispatch({ type: GET_SUGGESTION_USER, payload: { users: res.data.users, total: res.data.total} })
      dispatch({ type: LOADING_SUGGESTION, payload: false })
      
   } catch (err: any) {
      dispatch({ type: ALERT, payload: { error: err.response.data.msg } })
   }
}
