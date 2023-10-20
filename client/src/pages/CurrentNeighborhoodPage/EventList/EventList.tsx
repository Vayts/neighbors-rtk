import React from 'react';
import { useAppSelector } from '@src/hooks/hooks';
import EventItem from '@src/pages/CurrentNeighborhoodPage/EventList/EventItem/EventItem';
import styles from './EventList.module.scss';

const EventList: React.FC = () => {
  const events = useAppSelector((state) => state.events.ids);
  
  return (
    <ul className={styles.EventListWrapper}>
      {events.map((item) => {
        return (<EventItem eventId={item} key={item}/>);
      })}
    </ul>
  );
};

export default EventList;
