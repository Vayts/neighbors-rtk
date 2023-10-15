import React, { memo, useEffect, useState } from 'react';
import { IMessage } from '@src/types/chat.types';
import { format } from 'date-fns';
import cn from 'classnames';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import { IMember, IUser } from '@src/types/user.types';
import { useInView } from 'react-intersection-observer';
import { STATIC_HREF } from '@constants/core';
import { addViewedMessage } from '@src/store/messages/slice';
import styles from './Message.module.scss';

type Props = {
  message: IMessage,
  user: IUser,
}

const Message: React.FC<Props> = ({ message, user }) => {
  const { text, sentAt, seenBy } = message;
  const author: IMember = useAppSelector((state) => state.messageSenders.entities[message.author]);
  const viewedMessages = useAppSelector((state) => state.messages.viewedMessages);
  const userAlreadySeen = seenBy.includes(user._id) || viewedMessages.includes(message._id);
  const [wasInView, setWasInView] = useState(userAlreadySeen);
  const [ref, inView] = useInView({
    threshold: 0.9,
    initialInView: userAlreadySeen,
    delay: 500,
    triggerOnce: false,
    skip: userAlreadySeen,
  });
  const isAuthor = user._id === author._id;
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if (inView && !wasInView) {
      setWasInView(true);
      dispatch(addViewedMessage(message._id));
    }
  }, [inView]);

  return (
    <li
      className={cn(
        styles.MessageWrapper,
        isAuthor && styles.MessageWrapperUser,
        !wasInView || !userAlreadySeen && styles.MessageWrapperUnseen,
      )}
      ref={ref}
    >
      <div className={styles.MessageContent}>
        <img className={cn(styles.MessageAvatar, isAuthor && styles.MessageAvatarUser)} src={`${STATIC_HREF}/${author.avatar}`}/>
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
