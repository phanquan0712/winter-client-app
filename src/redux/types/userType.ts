import { IUser, IPost } from "../../utils/Typescript";
export const GET_USER = 'GET_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const FOLLOW = 'FOLLOW';
export const UN_FOLLOW = 'UN_FOLLOW';
export const GET_POST_USER = 'GET_POST_USER';
export const LOAD_USER_POST = 'LOAD_USER_POST';
export const GET_ID = 'GET_ID';


export interface IGetIdType {
   type: typeof GET_ID;
   payload: string
}

export interface IGetUserType {
   type: typeof GET_USER;
   payload: IUser;
}

export interface ILoadUserPostType {
   type: typeof LOAD_USER_POST;
   payload: boolean;
}

export interface IFollowType {
   type: typeof FOLLOW;
   payload: IUser;
}

export interface IUnFollowType {
   type: typeof UN_FOLLOW;
   payload: IUser;
}

export interface IUpdateProfile {
   fullname: string,
   mobile: string,
   address: string,
   website: string,
   story: string,
   gender: string,
   avatar: string | File
}

export interface IStateType {
   ids: string[]
   load: boolean
   users: IUser[];
   posts: IPost[];
   total?: number;
   page?: number
   _id?: string
}


export interface IGetPostType {
   type: typeof GET_POST_USER;
   payload: {
      posts: IPost[];
      total: number;
      page: number
      _id: string
   };
}

export type IProfileType = IFollowType | IGetUserType | IUnFollowType | IGetPostType | ILoadUserPostType | IGetIdType