import { PEER, IPeerType } from "../types/peerType";

const peerReducer = (state: any = {} as any,  action : IPeerType) => {
   switch (action.type) {
      case PEER:
         return action.payload
      default:    
         return state;
   }
}

export default peerReducer;