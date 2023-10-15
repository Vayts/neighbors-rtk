import { EntityId } from '@reduxjs/toolkit';

export interface IMessage {
  _id: string,
  author: EntityId,
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
  messages: EntityId[],
  hasMoreMessages: boolean,
  page: number,
  notificationCounter: number,
}
