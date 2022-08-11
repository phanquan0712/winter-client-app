import { IUser } from "../../utils/Typescript"


export const  LOADING_SUGGESTION = 'LOADING_SUGGESTION'
export const  GET_SUGGESTION_USER = 'GET_SUGGESTION_USER'


export interface ILoadingSuggestionType {
   type: typeof LOADING_SUGGESTION
   payload: boolean
}

export interface IGetSuggestionUser {
   users: IUser[]
   total: number
}

export interface IGetSuggestionUserType {
   type: typeof GET_SUGGESTION_USER
   payload: IGetSuggestionUser
}


export type ISuggestionUserType = ILoadingSuggestionType | IGetSuggestionUserType