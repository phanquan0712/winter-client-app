import { IPost } from './../../utils/Typescript';
import { ICommentType, OPEN_MODAL_COMMENT, IModalComment } from "../types/commentType"

const initState: IModalComment = {
   isOpen: false,
   isDetail: false,
   post: {} as IPost,
   onEdit: false
}





const commentReducer = (state: IModalComment = initState, action: ICommentType) => {
   switch (action.type) {
      case OPEN_MODAL_COMMENT: 
         return {
            ...state,
            ...action.payload
         }
      default: 
         return state;
   }
}

export default commentReducer;