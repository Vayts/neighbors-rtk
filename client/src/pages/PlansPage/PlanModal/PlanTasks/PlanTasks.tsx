import React from 'react';
import { IPlanParticipant, IPlanTask } from '@src/types/plan.types';
import PlanTaskItem from '@src/pages/PlansPage/PlanModal/PlanTasks/PlanTaskItem/PlanTaskItem';
import styles from './PlanTasks.module.scss';

type Props = {
  tasks: IPlanTask[],
  participants: IPlanParticipant[],
  planId: string,
  isClosed: boolean,
}

const PlanTasks: React.FC<Props> = ({ tasks, participants, planId, isClosed }) => {
  return (
    <ul className={styles.TasksList}>
      {tasks.map((item) => {
        return (
          <PlanTaskItem
            task={item}
            key={item._id}
            participants={participants}
            planId={planId}
            isClosed={isClosed}
          />
        );
      })}
    </ul>
  );
};

export default PlanTasks;
