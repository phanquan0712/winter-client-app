import { IPost } from "../../utils/Typescript";
import { IAuth } from "./authType";


export const CREATE_POST = 'CREATE_POST';
export const GET_POST = 'GET_POST';
export const UPDATE_POST = 'UPDATE_POST';
export const LIKE_POST = 'LIKE_POST';
export const UN_LIKE_POST = 'UN_LIKE_POST';
export const GET_DETAIL_POST = 'GET_DETAIL_POST';
export const POST_LOAD = 'POST_LOAD';
export const DELETE_POST = 'DELETE_POST';


export interface ICreatePostType  {
   type: typeof CREATE_POST;
   payload: IPost;
}

export interface IStatePost {
   load: boolean
   posts: IPost[]
   total: number
   page: number
}


export interface IPostLoadType {
   type: typeof POST_LOAD;
   payload: boolean;
}

export interface IGetPostType {
   type: typeof GET_POST
   payload: IStatePost
}


export interface IUpdatePostType {
   type: typeof UPDATE_POST;
   payload: IPost
}

export interface ILikePostType {
   type: typeof LIKE_POST;
   payload: IPost
}

export interface IUnLikePostType {
   type: typeof UN_LIKE_POST;
   payload: IPost
}


export interface IGetDetailPostType {
   type: typeof GET_DETAIL_POST;
   payload: IPost
}


export interface IDeletePostType {
   type: typeof DELETE_POST;
   payload: IPost
}

export type IPostType =IDeletePostType | ICreatePostType | IGetPostType | IUpdatePostType | ILikePostType | IUnLikePostType | IGetDetailPostType | IPostLoadType;