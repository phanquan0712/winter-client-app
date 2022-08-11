import { IImages } from './../../utils/Typescript';
import { IUser } from "../../utils/Typescript";


export const ADD_USER = 'ADD_USER';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const GET_CONVERSATION = 'GET_CONVERSATION';
export const GET_MESSAGES = 'GET_MESSAGES';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';
export const DELETE_CONVERSATION = 'DELETE_CONVERSATION'
export const CHECK_USER_ONLINE = 'CHECK_USER_ONLINE';



export interface IUserMessage extends IUser {
   text?: string
   media?: IImages[]
   online?: boolean
   call?: ISubCallType
}


export interface IStateType {
   users: IUserMessage[];
   totalUser: number;
   data: IMessage[];
   totalData: number;
   firstLoad: boolean;
}

export interface ISubCallType {
   video: boolean,
   times: number
}


export interface IMessage {
   _id?: string
   sender: string
   recipient: string
   text: string
   media: IImages[]
   createdAt: string
   call?: ISubCallType
}

export interface IAddUserType {
   type: typeof ADD_USER;
   payload: IUserMessage
}

export interface IAddMessageType {
   type: typeof ADD_MESSAGE;
   payload: IMessage
}

export interface IGetConversationType {
   type: typeof GET_CONVERSATION;
   payload: {
      users: IUserMessage[]
      total: number
   }
}


export interface IGetMessageType {
   type: typeof GET_MESSAGES;
   payload: {
      messages: IMessage[]
      total: number
   }
}

export interface IDeleteMessageType {
   type: typeof DELETE_MESSAGE;
   payload: IMessage
}

export interface IDeleteConversationType {
   type: typeof DELETE_CONVERSATION;
   payload: string
}

export interface ICheckUserOnlineType {
   type: typeof CHECK_USER_ONLINE;
   payload: string[]
}


export type IMessageTypes = ICheckUserOnlineType | IAddUserType | IAddMessageType |  IGetConversationType | IGetMessageType | IDeleteMessageType | IDeleteConversationType;