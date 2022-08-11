

export const ONLINE = 'ONLINE';
export const OFFLINE = 'OFFLINE';

export interface IOnLineType {
   type: typeof ONLINE | typeof OFFLINE;
   payload: string
}