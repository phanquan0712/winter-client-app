import { IUser } from './../../utils/Typescript';
import { LOADING_SUGGESTION, GET_SUGGESTION_USER , ISuggestionUserType  } from "../types/suggestionUserType";

interface IState {
   load?: boolean
   users: IUser[]
   total: number
}

const initState: IState = {
   load: false,
   users: [],
   total: 0
}

export const suggestionUserReducer = (state: IState = initState, action: ISuggestionUserType) => {
   switch (action.type) {
      case LOADING_SUGGESTION:
         return {
            ...state,
            load: action.payload
         }
      case GET_SUGGESTION_USER:
         return {
            ...state,
            users: action.payload.users,
            total: action.payload.total
         }
      default:
         return state
   }
}

export default suggestionUserReducer;