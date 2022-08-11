import { IOnLineType, ONLINE, OFFLINE } from './../types/onlineType';
import { IUser } from '../../utils/Typescript';

const onlineReducer = (state: string[] = [], action: IOnLineType) => {
   switch(action.type) {
      case ONLINE: 
         if(state.every(ele => ele !== action.payload)) {
            return [...state, action.payload];
         }
         return state;
      case OFFLINE: 
         return state.filter(item => item !== action.payload)
      default: 
         return state;
   }
}

export default onlineReducer