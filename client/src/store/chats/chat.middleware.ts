import { MiddlewareAPI, PayloadAction } from '@reduxjs/toolkit';
import io, { Socket } from 'socket.io-client';
import { normalize } from 'normalizr';
import { chatRoomSchema, messageSchema } from '@src/store/chats/schema';
import { setChats, updateMessages } from '@src/store/chats/slice';
import { addMessage, setMessages } from '@src/store/messages/slice';
import { addMessageSender, setMessageSenders } from '@src/store/messageSenders/slice';

export const chatSocketMiddleware = () => {
  let socket: Socket;
  return (store: MiddlewareAPI) => (next: (action: PayloadAction) => void) => (action: PayloadAction) => {
    const { type, payload }: {type: string, payload: any} = action;
    
    if (type.includes('chats')) {
      switch (type) {
      case 'chats/init':
        socket = io('ws://localhost:4020',
          {
            extraHeaders: {
              Authorization: `Bearer ${store.getState().auth.user.token}`,
            },
          });
        
        socket.on('joinedRooms', (res) => {
          const data = normalize(res, [chatRoomSchema]);
          
          store.dispatch(setChats(data.entities));
          store.dispatch(setMessages(data.entities));
          store.dispatch(setMessageSenders(data.entities));
        });
        
        socket.on('receiveMessage', (res) => {
          const userId = store.getState().auth.user._id;
          const data = normalize(res.message, messageSchema);
          const message = data.entities.messages[data.result];
          const sender = data.entities.senders[message.author];
          store.dispatch(updateMessages(message));
          store.dispatch(addMessage({ message, idsToUpdate: res.idsToUpdate, userId }));
          store.dispatch(addMessageSender(sender));
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
    
    // socket.connect('zxc');
    
    return next(action);
  };
};
