import { CALL, END_CALL, ICall, ICallerType } from '../types/callType';



const callReducer = (state: ICall = {} as ICall, action: ICallerType) => {
   switch (action.type) {
      case CALL:
         return action.payload
      default: 
         return state
   }
}  

export default callReducer;