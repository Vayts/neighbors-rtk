import { schema } from 'normalizr';

const memberSchema = new schema.Entity('senders', {}, { idAttribute: '_id' });

export const messageSchema = new schema.Entity('messages', {
  author: memberSchema,
}, { idAttribute: '_id' });

export const chatRoomSchema = new schema.Entity('chats', {
  messages: [messageSchema],
}, { idAttribute: 'chat_id' });
