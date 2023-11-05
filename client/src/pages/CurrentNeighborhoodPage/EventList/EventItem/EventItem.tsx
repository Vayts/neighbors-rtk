import React from 'react';
import { EntityId } from '@reduxjs/toolkit';
import { useAppSelector } from '@src/hooks/hooks';
import { STATIC_HREF } from '@constants/core';
import { EventTypeEnum } from '@src/types/event.types';
import { selectUser } from '@src/store/auth/selectors';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';
import styles from './EventItem.module.scss';

type Props = {
  eventId: EntityId,
}

const EventItem: React.FC<Props> = ({ eventId }) => {
  const user = useAppSelector(selectUser);
  const event = useAppSelector((state) => state.events.entities[eventId]);
  const author = useAppSelector((state) => state.members.entities[event.author_id]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const generateText = () => {
    if (event.type === EventTypeEnum.NewDebt) {
      return event.author_id === user?._id ? t('newDebtByUser') : t('newDebtForUser', { author: author.fullName });
    }
    
    if (event.type === EventTypeEnum.NewPlan) {
      return event.author_id === user?._id ? t('newPlanByUser') : t('newPlanForUser', { author: author.fullName });
    }
    
    if (event.type === EventTypeEnum.UserHasLeft) {
      return t('userHasLeft', { author: author.fullName });
    }
    
    if (event.type === EventTypeEnum.NewMember) {
      return t('userHasJoin', { author: author.fullName });
    }
  };
  
  const generateLink = () => {
    if (event.type === EventTypeEnum.NewDebt) {
      return `/debts?debt_id=${event.link}`;
    }
    
    if (event.type === EventTypeEnum.NewPlan) {
      return `/plans?plan_id=${event.link}`;
    }
  };
  
  const handleNavigate = () => {
    navigate(generateLink());
  };
  
  return (
    <li className={styles.EventItemWrapper}>
      <img
        className={styles.EventAuthorAvatar}
        src={`${STATIC_HREF}/${author.avatar}`}
        alt={`${author.fullName} avatar`}
      />
      <p className={styles.EventText}>
        {generateText()}
      </p>
      <span className={styles.EventDate}>
        {format(new Date(event.createdAt), 'HH:mm dd.MM.yyyy')}
      </span>
      {event.link && <span onClick={handleNavigate} className={cn(styles.EventLink, 'icon-link')}/>}
    </li>
  );
};

export default EventItem;
