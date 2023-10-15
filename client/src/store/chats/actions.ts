import { createAction } from '@reduxjs/toolkit';

export const chatSocketInit = createAction('chats/init');

export const chatSocketDisconnect = createAction('chats/disconnect');

export const sendMessage = createAction('chats/sendMessage', (message: string, roomId: string) => {
  return { payload: { message, roomId } };
});
