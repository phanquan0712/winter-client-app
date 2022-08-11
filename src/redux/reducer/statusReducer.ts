import { STATUS, IStatusType } from "../types/statusType";
import { IPost } from "../../utils/Typescript";
import { IStatus } from "../types/statusType";



const initState = {
   status: false,
   onEdit: false,
   post: {} as IPost
}


const statusReducer = (state: IStatus = initState, action: IStatusType) => {
   switch (action.type) {
      case STATUS:
         return action.payload;
      default: 
         return state;
   }
}

export default statusReducer;