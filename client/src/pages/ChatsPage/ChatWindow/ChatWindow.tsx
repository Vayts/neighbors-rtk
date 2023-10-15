import React from 'react';
import ChatForm from '@src/pages/ChatsPage/ChatWindow/СhatForm/ChatForm';
import MessageList from '@src/pages/ChatsPage/ChatWindow/MessageList/MessageList';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import { sendMessage } from '@src/store/chats/actions';
import styles from './ChatWindow.module.scss';

type Props = {
  roomId: string,
}

const ChatWindow: React.FC<Props> = ({ roomId }) => {
  const chat = useAppSelector((state) => state.chats.entities[roomId]);
  const dispatch = useAppDispatch();
  
  const handleSubmit = (message: string) => {
    dispatch(sendMessage(message, roomId));
  };
  
  return (
    <div className={styles.ChatWindowWrapper}>
      <h3 className={styles.ChatWindowTitle}>{chat.name || 'Chat'}</h3>
      <div className={styles.ChatWindowContent}>
        <MessageList selectedRoom={roomId}/>
        <ChatForm onSubmit={handleSubmit}/>
      </div>
    </div>
  );
};

export default ChatWindow;
