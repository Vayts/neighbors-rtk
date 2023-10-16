import React, { memo, useEffect } from 'react';
import { IMessage } from '@src/types/chat.types';
import { format } from 'date-fns';
import cn from 'classnames';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import { IMember } from '@src/types/user.types';
import { useInView } from 'react-intersection-observer';
import { STATIC_HREF } from '@constants/core';
import { addViewedMessage } from '@src/store/messages/slice';
import styles from './Message.module.scss';

type Props = {
  message: IMessage,
}

const Message: React.FC<Props> = ({ message }) => {
  const { text, sentAt, seenBy } = message;
  const user = useAppSelector((state) => state.auth.user);
  const author: IMember = useAppSelector((state) => state.members.entities[message.author]);
  const userAlreadySeen = seenBy.includes(user._id);
  const [ref, inView] = useInView({
    threshold: 0.9,
    initialInView: userAlreadySeen,
    delay: 500,
    triggerOnce: true,
    skip: userAlreadySeen,
  });
  const isAuthor = user._id === author._id;
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if (inView && !userAlreadySeen) {
      dispatch(addViewedMessage({ messageId: message._id, userId: user._id }));
    }
  }, [inView]);

  return (
    <li
      className={cn(
        styles.MessageWrapper,
        isAuthor && styles.MessageWrapperUser,
        !userAlreadySeen && styles.MessageWrapperUnseen,
      )}
      ref={userAlreadySeen ? null : ref}
    >
      <div className={styles.MessageContent}>
        
        <img
          className={cn(styles.MessageAvatar, isAuthor && styles.MessageAvatarUser)}
          src={`${STATIC_HREF}/${author.avatar}`}
          alt={`${author.avatar} avatar`}
        />
        
        <div className={styles.MessageDialogue}>
          <div className={styles.MessageTitleWrapper}>
            <h4 className={styles.MessageAuthorFullName}>{author.fullName}</h4>
            <span className={styles.MessageDate}>{format(new Date(sentAt), 'HH:mm, dd.MM.yyyy')}</span>
          </div>
          {text}
        </div>
        
      </div>
    </li>
  );
};

export default memo(Message);
