import React, { useCallback } from 'react';
import { IPlan } from '@src/types/plan.types';
import PlanCard from '@src/pages/PlansPage/PlanCard/PlanCard';
import Modal from '@src/components/Modal/Modal';
import PlanModal from '@src/pages/PlansPage/PlanModal/PlanModal';
import { useAppSelector } from '@src/hooks/hooks';
import { useSearchParams } from 'react-router-dom';
import styles from './PlansList.module.scss';

type Props = {
  visiblePlans: IPlan[],
}

const PlansList: React.FC<Props> = ({ visiblePlans }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const planId = searchParams.get('plan_id');
  const selectedPlan = useAppSelector((state) => state.plans.entities[planId]);
  
  const handleCloseDebtModal = () => {
    setSearchParams();
  };
  
  const handlePlanClick = useCallback((plan: IPlan) => {
    setSearchParams({ plan_id: plan._id });
  }, []);
  
  return (
    <>
      {selectedPlan && (
        <Modal
          outsideHandler={handleCloseDebtModal}
          withCloseIcon
        >
          <PlanModal plan={selectedPlan} />
        </Modal>
      )}
      <div className={styles.PlansList}>
        {visiblePlans.map((item) => {
          return (
            <PlanCard
              plan={item}
              key={item._id}
              onClick={handlePlanClick}
            />
          );
        })}
      </div>
    </>
  );
};

export default PlansList;
