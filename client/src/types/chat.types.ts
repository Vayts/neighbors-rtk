import { IMember } from '@src/types/user.types';

export interface IMessage {
  _id: string,
  author: IMember,
  text: string,
  sentAt: Date,
  chat_id: string,
  seenBy: string[],
}

export interface IChatRoom {
  _id: string,
  avatar: string,
  name: string,
  chat_id: string,
  messages: IMessage[],
  hasMoreMessages: boolean,
  page: 1,
  notificationCounter: number,
}
