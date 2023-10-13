import React, { useCallback, useEffect, useState } from 'react';
import { IPlan } from '@src/types/plan.types';
import PlanCard from '@src/pages/PlansPage/PlanCard/PlanCard';
import Modal from '@src/components/Modal/Modal';
import PlanModal from '@src/pages/PlansPage/PlanModal/PlanModal';
import { useAppSelector } from '@src/hooks/hooks';
import { selectAllPlans } from '@src/store/plans/selectors';
import styles from './PlansList.module.scss';

type Props = {
  visiblePlans: IPlan[],
}

const PlansList: React.FC<Props> = ({ visiblePlans }) => {
  const plans = useAppSelector(selectAllPlans);
  const [selectedPlan, setSelectedPlan] = useState<IPlan | null>(null);
  
  const handleCloseDebtModal = () => {
    setSelectedPlan(null);
  };
  
  useEffect(() => {
    if (selectedPlan) {
      plans.forEach((item) => {
        if (item._id === selectedPlan._id) {
          setSelectedPlan(item);
        }
      });
    }
  }, [plans]);
  
  const handlePlanClick = useCallback((plan: IPlan) => {
    setSelectedPlan(plan);
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
      <ul className={styles.PlansList}>
        {visiblePlans.map((item) => {
          return (
            <PlanCard
              plan={item}
              key={item._id}
              onClick={handlePlanClick}
            />
          );
        })}
      </ul>
    </>
  );
};

export default PlansList;
