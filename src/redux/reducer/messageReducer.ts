import { ADD_USER, GET_MESSAGES, CHECK_USER_ONLINE, DELETE_CONVERSATION, ADD_MESSAGE, DELETE_MESSAGE, GET_CONVERSATION, IMessageTypes, IStateType } from "../types/messageType";


const initState: IStateType = {
   users: [],
   totalUser: 0,
   data: [],
   totalData: 0,
   firstLoad: false
}

const messageReducer = (state: IStateType = initState, action: IMessageTypes) => {
   switch (action.type) {
      case ADD_USER:
         if(state.users.every(item => item._id !== action.payload._id)) {
            return {
               ...state,
               users: [action.payload, ...state.users],
               totalUser: state.totalUser + 1
            }
         } else return state;
      case ADD_MESSAGE:
         return {
            ...state,
            data: [...state.data, action.payload],
            totalData: state.totalData + 1,
            users: state.users.map(user => (
               user._id === action.payload.sender || user._id === action.payload.recipient ?
                  { ...user, text: action.payload.text, media: action.payload.media, call: action.payload.call } : user
            )),
         }
      case GET_CONVERSATION:
         return {
            ...state,
            users: action.payload.users,
            totalUser: action.payload.total,
            firstLoad: true
         }
      case GET_MESSAGES:
         return {
            ...state,
            data: action.payload.messages ? action.payload.messages.reverse() : [],
            totalData: action.payload.total,
         }
      case DELETE_MESSAGE:
         return {
            ...state,
            data: state.data.filter(message => message._id !== action.payload._id),
            totalData: state.totalData - 1
         }
      case DELETE_CONVERSATION:
         return {
            ...state,
            users: state.users.filter(user => user._id !== action.payload),
            data: [],
            totalData: 0,
            totalUser: state.totalUser - 1
         }
      case CHECK_USER_ONLINE:
         return {
            ...state,
            users: state.users.map(user => (
               action.payload.includes(user._id) ? { ...user, online: true }
                  : { ...user, online: false }
            ))
         }
      default:
         return state;
   }
}

export default messageReducer;