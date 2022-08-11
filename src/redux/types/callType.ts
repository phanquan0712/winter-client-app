

export const CALL = 'CALL';
export const END_CALL = 'END_CALL';

export interface ICall {
   isOpen: boolean
   sender: string
   recipient: string
   avatar: string
   username: string
   fullname: string
   video: boolean
   peer?: string
}

export interface ICallType {
   type: typeof CALL
   payload: ICall
}

export interface IEndCallType {
   type: typeof END_CALL
   payload: {
      isOpen: false
   }
}

export type ICallerType = ICallType | IEndCallType;