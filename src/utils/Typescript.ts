import { ChangeEvent, FormEvent, MouseEvent, KeyboardEvent  } from "react"
import rootReducer from '../redux/reducer/index'

export type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement |  HTMLSelectElement >
export type MouseClick = MouseEvent<HTMLDivElement | MouseEvent>
export type KeyboardClick = KeyboardEvent<HTMLDivElement | KeyboardEvent | HTMLTextAreaElement>
export type FormSubmit = FormEvent<HTMLFormElement>
export type RootStore = ReturnType<typeof rootReducer>


export interface IParams {
   page? : string
   id? : string
}

export interface IUser {
   _id: string
   fullname: string, 
   username: string
   email: string
   password: string
   role: string
   avatar: string
   gender: string
   website: string
   mobile: string
   address: string
   story: string
   followers: IUser[]
   following: IUser[]
   saved: string[]
   createdAt: string
   updatedAt: string
}




export interface ILoginUser {
   email: string,
   password: string
}

export interface IRegisterUser extends ILoginUser {
   fullname: string
   username: string
   cf_password: string
   gender: string
}


export interface IPost {
   _id: string
   comments?: IComment[]
   content: string
   createdAt: string
   updatedAt: string
   user: IUser
   likes: IUser[]
   images: any[] | IImages[]
   _doc?: Document 
}

export interface IImages {
   public_id: string
   url: string
}

export interface IPostNew {
   _id: string
   comments?: IComment[]
   content: string
   createdAt: string
   updatedAt: string
   user: IUser
   likes: IUser[]
   images: IImages[]
   _doc?: Document 
}


export interface IComment {
   _id?: string
   content: string
   tag?: IUser
   reply?: IComment[]
   likes?: IUser[]
   user: IUser
   createdAt: string
}