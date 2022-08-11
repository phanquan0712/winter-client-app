
export const ALERT = 'ALERT';




export interface IALert {
   loading?: boolean
   success?: string
   error?: string | string[]
   errCode?: number
}

export interface IAlertType {
   type: typeof ALERT
   payload: IALert
}