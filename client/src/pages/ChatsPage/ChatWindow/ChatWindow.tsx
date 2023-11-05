import React from 'react';
import ChatForm from '@src/pages/ChatsPage/ChatWindow/СhatForm/ChatForm';
import MessageList from '@src/pages/ChatsPage/ChatWindow/MessageList/MessageList';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import { sendMessage } from '@src/store/chats/actions';
import cn from 'classnames';
import styles from './ChatWindow.module.scss';

type Props = {
  roomId: string,
  isOpen: boolean,
  setSelectedRoom: (value: string | null) => void,
}

const ChatWindow: React.FC<Props> = ({ roomId, isOpen, setSelectedRoom }) => {
  const chat = useAppSelector((state) => state.chats.entities[roomId]);
  const dispatch = useAppDispatch();
  
  const handleSubmit = (message: string) => {
    dispatch(sendMessage(message, roomId));
  };
  
  const handleHideChat = () => {
    setSelectedRoom(null);
  };
  
  return (
    <div className={cn(styles.ChatWindowWrapper, isOpen && styles.ChatWindowWrapperOpen)}>
      <div className={styles.ChatWindowTitleWrapper}>
        <span className={cn('icon-left', styles.ChatListButton)} onClick={handleHideChat}/>
        <h3 className={styles.ChatWindowTitle}>{chat.name || 'Chat'}</h3>
      </div>
      
      <div className={styles.ChatWindowContent}>
        <MessageList selectedRoom={roomId}/>
        <ChatForm onSubmit={handleSubmit}/>
      </div>
    </div>
  );
};

export default ChatWindow;
