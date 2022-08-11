import { IComment, IPost, IUser } from "../../utils/Typescript";

export const CREATE_COMMENT = 'CREATE_COMMENT';
export const OPEN_MODAL_COMMENT = 'OPEN_MODAL_COMMENT';
export const ANSWER_COMMENT = 'ANSWER_COMMENT';

export interface ICreateCommentType {
   type: typeof CREATE_COMMENT
   payload: IComment
}


export interface IModalComment {
   isOpen: boolean
   isDetail?: boolean
   post: IPost
   onEdit?: boolean
   commentEdit?: IComment
}

export interface IModalCommentType {
   type: typeof OPEN_MODAL_COMMENT
   payload: IModalComment
}

export interface IAnswerComment {
   isAnswer: boolean
   comment: IComment
   replyComment?: IComment
   isAnswerCommentAnswer? : boolean
}

export interface IAnswerCommentType {
   type: typeof ANSWER_COMMENT
   payload: IAnswerComment
}


export type ICommentType = IAnswerCommentType | ICreateCommentType | IModalCommentType;