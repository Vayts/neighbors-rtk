import React, { useEffect } from 'react';
import Loader from '@src/components/Loader/Loader';
import NeighborhoodSwitcher from '@src/components/NeighborhoodSwitcher/NeighborhoodSwitcher';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import { getCurrentNeighborhood } from '@src/store/currentNeighborhood/thunks';
import { useParams } from 'react-router-dom';
import NeighborhoodInfo from '@src/pages/CurrentNeighborhoodPage/NeighborhoodInfo/NeighborhoodInfo';
import EventList from '@src/pages/CurrentNeighborhoodPage/EventList/EventList';
import { useScrollTopOnMount } from '@src/hooks/useScrollTopOnMount';
import styles from './CurrentNeighborhoodPage.module.scss';

const CurrentNeighborhoodPage: React.FC = () => {
  useScrollTopOnMount();
  const { id } = useParams();
  const isLoading = useAppSelector((state) => state.currentNeighborhood.isLoading);
  const neighborhood = useAppSelector((state) => state.currentNeighborhood.neighborhood);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  useEffect(() => {
    if (neighborhood?._id !== id) {
      dispatch(getCurrentNeighborhood(id));
    }
  }, [id]);
  
  return (
    <div className={styles.CurrentPageWrapper}>
      <div className={styles.CurrentPageControls}>
        <div className={styles.CurrentPageTitleWrapper}>
          <h3>{t('neighborhoods')}</h3>
          <NeighborhoodSwitcher link="/neighborhoods"/>
        </div>
      </div>
      {isLoading && <Loader/>}
      {neighborhood && !isLoading && (
        <div className={styles.CurrentContentWrapper}>
          <NeighborhoodInfo/>
          <EventList/>
        </div>
      )}
    </div>
  );
};

export default CurrentNeighborhoodPage;
