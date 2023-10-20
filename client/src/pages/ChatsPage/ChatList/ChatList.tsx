import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@src/hooks/hooks';
import { selectAllChatRooms } from '@src/store/chats/selectors';
import cn from 'classnames';
import styles from './ChatList.module.scss';

type Props = {
  setSelectedRoom: (val: string) => void;
  selectedRoom: string | null,
}

const ChatList: React.FC<Props> = ({ setSelectedRoom, selectedRoom }) => {
  const rooms = useAppSelector(selectAllChatRooms);
  const { t } = useTranslation();
  
  const handleSelectRoom = (name: string) => {
    setSelectedRoom(name);
  };
  
  return (
    <div className={styles.ChatListWrapper}>
      <h3 className={styles.ChatListTitle}>{t('chats')}</h3>
      <div className={styles.ChatListContent}>
        <ul className={styles.ChatList}>
          {rooms.map((room) => {
            return (
              <li
                className={cn(styles.ChatItem, selectedRoom === room._id && styles.ChatItemSelected)}
                key={room._id}
                onClick={() => handleSelectRoom(room._id)}
              >
                {!room.avatar && (
                  <div className={styles.NeighborhoodAvatarFiller}>
                    <span className='icon-neighborhoods'/>
                  </div>
                )}
                <p>{room.name}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default memo(ChatList);
