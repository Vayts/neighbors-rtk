import { MiddlewareAPI, PayloadAction } from '@reduxjs/toolkit';
import io, { Socket } from 'socket.io-client';
import { normalize } from 'normalizr';
import { chatRoomSchema, messageSchema } from '@src/store/chats/schema';
import { setChats, updateMessages } from '@src/store/chats/slice';
import { addMessage, setMessages, updateUnseenMessage } from '@src/store/messages/slice';
import { addMember, addMembers } from '@src/store/members/slice';

export const chatSocketMiddleware = (url: string) => {
  let socket: Socket;
  return (store: MiddlewareAPI) => (next: (action: PayloadAction) => void) => (action: PayloadAction) => {
    const { type, payload }: {type: string, payload: any} = action;
    
    if (type.includes('chats')) {
      switch (type) {
      case 'chats/init':
        socket = io(url,
          {
            extraHeaders: {
              Authorization: `Bearer ${store.getState().auth.user.token}`,
            },
          });
        
        socket.on('joinedRooms', (res) => {
          const data = normalize(res, [chatRoomSchema]);
          store.dispatch(setChats(data.entities));
          store.dispatch(setMessages(data.entities));
          store.dispatch(addMembers(data.entities));
        });
        
        socket.on('receiveMessage', (res) => {
          const data = normalize(res.message, messageSchema);
          const message = data.entities.messages[data.result];
          const sender = data.entities.members[message.author];
          store.dispatch(updateMessages(message));
          store.dispatch(addMessage(message));
          store.dispatch(addMember(sender));
        });
        
        socket.on('updateUnseenMessage', (res) => {
          const userId = store.getState().auth.user._id;
          store.dispatch(updateUnseenMessage({ idsToUpdate: res, userId }));
        });
        break;
        
      case 'chats/disconnect':
        socket.disconnect();
        break;
        
      case 'chats/sendMessage':
        socket.emit('sendMessageToChat', { ...payload });
        break;
        
      default:
        break;
      }
    }
    
    return next(action);
  };
};
