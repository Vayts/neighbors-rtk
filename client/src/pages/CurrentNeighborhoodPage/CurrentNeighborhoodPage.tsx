import React, { useEffect } from 'react';
import Loader from '@src/components/Loader/Loader';
import NeighborhoodSwitcher from '@src/components/NeighborhoodSwitcher/NeighborhoodSwitcher';
import { useTranslation } from 'react-i18next';
// import NeighborhoodMain from '@src/pages/CurrentNeighborhoodPage/NeighborhoodMain/NeighborhoodMain';
import { useAppDispatch } from '@src/hooks/hooks';
import { getCurrentNeighborhood } from '@src/store/currentNeighborhood/thunks';
import { useParams } from 'react-router-dom';
import styles from './CurrentNeighborhoodPage.module.scss';

const CurrentNeighborhoodPage: React.FC = () => {
  const { id } = useParams();
  const isLoading = false;
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  useEffect(() => {
    dispatch(getCurrentNeighborhood(id));
  }, []);
  
  return (
    <div className={styles.CurrentPageWrapper}>
      <div className={styles.CurrentPageControls}>
        <div className={styles.CurrentPageTitleWrapper}>
          <h3>{t('neighborhoods')}</h3>
          <NeighborhoodSwitcher link="/neighborhoods"/>
        </div>
      </div>
      {isLoading ? <Loader/> : (
        <div className={styles.CurrentContentWrapper}>
          {/*<NeighborhoodMain/>*/}
          {/*<NeighborhoodSidebar/>*/}
        </div>
      )}
    </div>
  );
};

export default CurrentNeighborhoodPage;
