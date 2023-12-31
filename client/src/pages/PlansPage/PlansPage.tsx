import React, { useEffect } from 'react';
import NeighborhoodSwitcher from '@src/components/NeighborhoodSwitcher/NeighborhoodSwitcher';
import { useTranslation } from 'react-i18next';
import Button from '@src/components/UI/Button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import PlansList from '@src/pages/PlansPage/PlansList/PlansList';
import { selectAllPlans } from '@src/store/plans/selectors';
import { getUserPlans } from '@src/store/plans/thunks';
import NoItemBanner from '@src/components/NoItemBanner/NoItemBanner';
import { useScrollTopOnMount } from '@src/hooks/useScrollTopOnMount';
import PlanSkeleton from '@src/pages/PlansPage/PlanSkeleton/PlanSkeleton';
import styles from './PlansPage.module.scss';

const PlansPage: React.FC = () => {
  useScrollTopOnMount();
  const { id } = useParams();
  const isLoading = useAppSelector((state) => state.plans.isLoading);
  const plans = useAppSelector(selectAllPlans);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  useEffect(() => {
    if (!id) {
      dispatch(getUserPlans(''));
    } else {
      dispatch(getUserPlans(id));
    }
  }, [id]);
  
  const handleNavigateToCreate = () => {
    if (!id) {
      navigate('/plans/create');
    } else {
      navigate(`/plans/create/${id}`);
    }
  };
  
  return (
    <div className={styles.PlansPageWrapper}>
      <div className={styles.PlansControls}>
        <div className={styles.PlansTitleWrapper}>
          <h3>{t('plans')}</h3>
          <NeighborhoodSwitcher link="/plans"/>
        </div>
        <div className={styles.DebtsButtons}>
          <Button
            onClick={handleNavigateToCreate}
            text={t('createPlan')}
            icon='icon-plus'
          />
        </div>
      </div>
      <div className={styles.PlansContentHolder}>
        {!isLoading && Boolean(!plans.length) && (
          <NoItemBanner
            link='plans'
            img='banner7.png'
            title='noPlansBannerText'
            withIdText='noPlansText'
            noIdText='noPlansText'
            buttonText='createPlan'
          />
        )}
        
        <div className={styles.PlansContentWrapper}>
          {isLoading ? <PlanSkeleton amount={3}/> : <PlansList visiblePlans={plans}/>}
        </div>
        
      </div>
    </div>
  );
};

export default PlansPage;
