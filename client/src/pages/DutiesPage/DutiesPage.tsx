import React, { useEffect } from 'react';
import NeighborhoodSwitcher from '@src/components/NeighborhoodSwitcher/NeighborhoodSwitcher';
import Button from '@src/components/UI/Button/Button';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import { getUserDuties } from '@src/store/duties/thunks';
import { selectAllDuties } from '@src/store/duties/selectors';
import NoItemBanner from '@src/components/NoItemBanner/NoItemBanner';
import DutiesList from '@src/pages/DutiesPage/DutiesList/DutiesList';
import { useScrollTopOnMount } from '@src/hooks/useScrollTopOnMount';
import DutySkeleton from '@src/pages/DutiesPage/DutySkeleton/DutySkeleton';
import styles from './DutiesPage.module.scss';

const DutiesPage: React.FC = () => {
  useScrollTopOnMount();
  const { id } = useParams();
  const duties = useAppSelector(selectAllDuties);
  const isLoading = useAppSelector((state) => state.duties.isLoading);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  useEffect(() => {
    if (!id) {
      dispatch(getUserDuties(''));
    } else {
      dispatch(getUserDuties(id));
    }
  }, [id]);
  
  const handleNavigateToCreate = () => {
    if (!id) {
      navigate('/duties/create');
    } else {
      navigate(`/duties/create/${id}`);
    }
  };
  
  return (
    <div className={styles.DutiesPageWrapper}>
      <div className={styles.DutiesControls}>
        <div className={styles.DutiesTitleWrapper}>
          <h3>{t('duties')}</h3>
          <NeighborhoodSwitcher link="/duties"/>
        </div>
        <div className={styles.DebtsButtons}>
          <Button
            onClick={handleNavigateToCreate}
            text={t('createDuty')}
            icon='icon-plus'
          />
        </div>
      </div>
      <div className={styles.DutiesContentHolder}>
        {!isLoading && Boolean(!duties.length) && (
          <NoItemBanner
            link='duties'
            img='banner15.png'
            title='noDutiesBannerText'
            withIdText='noDutiesText'
            noIdText='noDutiesText'
            buttonText='createDuty'
          />
        )}
        <span/>

        <div className={styles.DutiesContentWrapper}>
          {isLoading ? <DutySkeleton amount={3}/> : <DutiesList/>}
        </div>
        
      </div>
    </div>
  );
};

export default DutiesPage;
