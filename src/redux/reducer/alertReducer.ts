import { ALERT, IALert, IAlertType} from "../types/alertType";


const alertReducer = (state: IALert = {}, action: IAlertType) => {
   switch (action.type) {
      case ALERT:
         return action.payload;
      default:
         return state;
   }
}

export default alertReducer;

