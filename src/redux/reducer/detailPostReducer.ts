import { IPost } from "../../utils/Typescript";
import { GET_DETAIL_POST, IGetDetailPostType } from "../types/postType";


const detailPostReducer = (state: IPost = {} as IPost, action: IGetDetailPostType) => {
   switch(action.type) {
      case GET_DETAIL_POST:
         return action.payload;
      default:
         return state;
   }
}


export default detailPostReducer;