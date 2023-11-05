import React, { memo, useEffect, useRef, useState } from 'react';
import Message from '@src/pages/ChatsPage/ChatWindow/MessageList/Message/Message';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import { selectMessagesByIds } from '@src/store/messages/selectors';
import { selectUser } from '@src/store/auth/selectors';
import { NO_SMOOTH_SCROLL_VALUE } from '@constants/core';
import { loadMoreMessages, updateViewedMessages } from '@src/store/messages/thunks';
import styles from './MessageList.module.scss';

type Props = {
  selectedRoom: string,
}

const MessageList: React.FC<Props> = ({ selectedRoom }) => {
  const room = useAppSelector((state) => state.chats.entities[selectedRoom]);
  const messages = useAppSelector((state) => selectMessagesByIds(state, state.chats.entities[selectedRoom].messages));
  const isLoading = useAppSelector((state) => state.messages.isLoading);
  const [isFirstLoad, setFirstLoad] = useState(true);
  const user = useAppSelector(selectUser);
  const listRef = useRef<HTMLUListElement>(null);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if (listRef.current && messages.length && !isFirstLoad) {
      const lastMessage = messages[messages.length - 1];
      const lastChild = listRef.current.children[messages.length - 1];
      const scrollTop = listRef.current.scrollTop;
      const scrollHeight = listRef.current.scrollHeight;
      const clientHeight = listRef.current.clientHeight;
      const distanceFromEnd = scrollHeight - scrollTop - clientHeight;
      
      if (lastChild && lastMessage.author !== user?._id && distanceFromEnd < 200) {
        lastChild.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      }
      
      if (lastChild && lastMessage.author === user?._id) {
        lastChild.scrollIntoView({
          behavior: distanceFromEnd > NO_SMOOTH_SCROLL_VALUE ? 'auto' : 'smooth',
          block: 'end',
        });
      }
    }
  }, [messages[messages.length - 1]]);
  
  useEffect(() => {
    if (listRef.current && messages.length) {
      const lastMessageIndex = messages.length - 1;
      const firstUnseenMessageIndex = messages.findIndex((item) => !item.seenBy.includes(user?._id));
      const lastChild = listRef.current.children[firstUnseenMessageIndex >= 0 ? firstUnseenMessageIndex : lastMessageIndex];
      if (lastChild) {
        lastChild.scrollIntoView({
          behavior: 'auto',
          block: 'end',
        });
      }
    }
    setFirstLoad(false);
    
    return () => {
      dispatch(updateViewedMessages());
    };
  }, [selectedRoom]);
  
  const handleScroll = () => {
    if (listRef.current && room.hasMoreMessages) {
      if (listRef.current.scrollTop === 0 && !isLoading) {
        const prevScroll = listRef.current.scrollHeight - listRef.current.scrollTop - listRef.current.clientHeight;
        dispatch(loadMoreMessages(selectedRoom)).then(() => {
          listRef.current.scrollTop = listRef.current.scrollHeight - listRef.current.clientHeight - prevScroll;
        });
      }
    }
  };
  
  return (
    <ul ref={listRef} className={styles.MessageList} onScroll={handleScroll}>
      {messages.map((item) => {
        return (
          <Message key={item._id} message={item}/>
        );
      })}
    </ul>
  );
};

export default memo(MessageList);
