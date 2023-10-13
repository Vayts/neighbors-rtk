import React from 'react';
import Checkbox from '@src/components/UI/Checkbox/Checkbox';
import { IPlanParticipant, IPlanTask } from '@src/types/plan.types';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import cn from 'classnames';
import { selectUser } from '@src/store/auth/selectors';
import { changePlanTaskStatus } from '@src/store/plans/thunks';
import styles from './PlanTaskItem.module.scss';

type Props = {
  task: IPlanTask,
  participants: IPlanParticipant[],
  planId: string,
  isClosed: boolean,
}

const PlanTaskItem: React.FC<Props> = ({ task, participants, planId, isClosed }) => {
  const { completed, completedBy, completedAt, text, _id } = task;
  const isLoading = useAppSelector((state) => state.plans.loadingItems).includes(planId);
  const user = useAppSelector(selectUser);
  const completedDate = completed ? format(new Date(completedAt as Date), 'HH:mm dd/MM/yyyy') : '';
  const completedByUser = completed ? participants.find((item) => item._id === completedBy)?.fullName : '';
  const isCompletedNotByCurrentUser = completed && completedBy !== user?._id;
  const dispatch = useAppDispatch();
  
  const handleChangeStatus = () => {
    dispatch(changePlanTaskStatus({ taskId: _id, planId }));
  };
  
  return (
    <>
      <li className={cn(styles.TaskWrapper, completed && styles.TaskWrapperChecked)}>
        <Checkbox
          checked={completed}
          onChange={handleChangeStatus}
          name={`${_id}-task`}
          label={text}
          disabled={isCompletedNotByCurrentUser || isLoading || isClosed}
        />
      </li>
      {completed && (
        <div className={cn(styles.TaskComment, user?._id === completedBy && styles.TaskCommentByUser)}>
          <span>{completedByUser || ''}</span>
          <span>{completedDate}</span>
        </div>
      )}
    </>
  );
};

export default PlanTaskItem;
