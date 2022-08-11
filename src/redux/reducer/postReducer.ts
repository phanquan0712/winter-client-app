import {
   CREATE_POST, GET_POST,
   UPDATE_POST, IPostType,
   IStatePost, LIKE_POST,
   UN_LIKE_POST, POST_LOAD,
   DELETE_POST
} from "../types/postType";





const initState: IStatePost = {
   load: false,
   posts: [],
   total: 0,
   page: 1
}


const postReducer = (state: IStatePost = initState, action: IPostType) => {
   switch (action.type) {
      case POST_LOAD: 
         return {
            ...state, 
            load: true
         }
      case CREATE_POST:
         return {
            ...state,
            posts: [action.payload, ...state.posts],
         }
      case GET_POST:
         return {
            ...state,
            posts: action.payload.posts,
            total: action.payload.total,
            page: action.payload.page ? action.payload.page : state.page,
            load: false,
         }
      case UPDATE_POST:
         return {
            ...state,
            posts: state.posts.map(post => (
               post._id === action.payload._id ? action.payload : post
            ))
         }
      case LIKE_POST: 
         return {
            ...state,
            posts: state.posts.map(post => (
               post._id === action.payload._id ? action.payload : post
            ))
         }
      case UN_LIKE_POST: 
         return {
            ...state,
            posts: state.posts.map(post => (
               post._id === action.payload._id ? action.payload : post
            ))
         }
      case DELETE_POST: 
         return {
            ...state,
            posts: state.posts.filter(post => post._id !== action.payload._id)
         }
      default:
         return state;
   }
}


export default postReducer