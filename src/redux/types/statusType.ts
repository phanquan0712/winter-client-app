import { IPost } from "../../utils/Typescript";


export const STATUS = 'STATUS';

export interface IStatus {
   status: boolean
   onEdit: boolean
   post: IPost
}


export interface IStatusType {
   type: typeof STATUS;
   payload: IStatus;
}