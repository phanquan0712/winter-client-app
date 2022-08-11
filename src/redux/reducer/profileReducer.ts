import { GET_USER, GET_ID,  LOAD_USER_POST, IStateType, FOLLOW, IProfileType, UN_FOLLOW, GET_POST_USER } from "../types/userType";
import { IUser } from "../../utils/Typescript";

const initState: IStateType = {
   load: false,
   ids: [],
   users: [],
   posts: [],
   total: 0,
   _id: '',
   page: 2
}

const userReducer = (state: IStateType = initState, action: IProfileType) => {
   switch (action.type) {
      case LOAD_USER_POST:
         return {
            ...state,
            load: true
         }
      case GET_ID: 
         return  {
            ...state,
            ids: [...state.ids, action.payload]
         }
      case GET_USER:
         return {
            ...state,
            load: false,
            users: state.users.every(item => item._id !== action.payload._id) ? [...state.users, action.payload] : state.users,
         }
      case FOLLOW :
         return {
            ...state,
            users: state.users.map(item => 
               item._id === action.payload._id ? action.payload : item
            )
         }
      case UN_FOLLOW: 
         return{
            ...state,
            users: state.users.map(item => 
               item._id === action.payload._id ? action.payload : item
            )
         }
      case GET_POST_USER: 
         return {
            ...state,
            load: false,
            posts: action.payload.posts,
            total: action.payload.total,
            page: action.payload.page,
            _id: action.payload._id
         }
      default:
         return state;
   }
}


export default userReducer;