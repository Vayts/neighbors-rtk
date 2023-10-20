import React, { memo, useEffect, useState } from 'react';
import ChatList from '@src/pages/ChatsPage/ChatList/ChatList';
import ChatWindow from '@src/pages/ChatsPage/ChatWindow/ChatWindow';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import { selectUser } from '@src/store/auth/selectors';
import { chatSocketDisconnect, chatSocketInit } from '@src/store/chats/actions';
import styles from './ChatsPage.module.scss';

const ChatsPage: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(chatSocketInit());
    
    return () => {
      dispatch(chatSocketDisconnect());
    };
  }, []);
  
  return (
    <div className={styles.ChatWrapper}>
      <ChatList
        setSelectedRoom={setSelectedRoom}
        selectedRoom={selectedRoom}
      />
      {selectedRoom && <ChatWindow roomId={selectedRoom}/>}
    </div>
  );
};

export default memo(ChatsPage);
