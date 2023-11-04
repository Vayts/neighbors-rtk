import React from 'react';
import { IPlan } from '@src/types/plan.types';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import ParticipantsTable from '@src/pages/PlansPage/PlanModal/ParticipantsTable/ParticipantsTable';
import ProgressBarWithUserPayment from '@src/components/ProgressBarWithUserPayment/ProgressBarWithUserPayment';
import PlanTasks from '@src/pages/PlansPage/PlanModal/PlanTasks/PlanTasks';
import PlanPaymentForm from '@src/pages/PlansPage/PlanModal/PlanPaymentForm/PlanPaymentForm';
import { CurrencySymbolEnum } from '@src/types/default.types';
import Button from '@src/components/UI/Button/Button';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import { IUser } from '@src/types/user.types';
import { selectUser } from '@src/store/auth/selectors';
import { closePlan, reopenPlan } from '@src/store/plans/thunks';
import { setLoadingPlans } from '@src/store/plans/slice';
import { selectMembersByIds } from '@src/store/members/selectors';
import styles from './PlanModal.module.scss';

type Props = {
  plan: IPlan,
}

const PlanModal: React.FC<Props> = ({ plan }) => {
  const {
    _id,
    eventDate,
    tasksList,
    currentPayment,
    isPaymentRequired,
    neighborhood,
    createdAt,
    participantPayments,
    name,
    description,
    paymentAmount,
    isClosed,
  } = plan;
  const user = useAppSelector(selectUser) as IUser;
  const isLoading = useAppSelector((state) => state.plans.loadingItems).includes(_id);
  const author = useAppSelector((state) => state.members.entities[plan.author]);
  const participants = useAppSelector((state) => selectMembersByIds(state, plan.participants));
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  const handleClosePlan = () => {
    dispatch(setLoadingPlans(_id));
    dispatch(closePlan(_id))
      .finally(() => {
        dispatch(setLoadingPlans(_id));
      });
  };
  
  const handleReopenPlan = () => {
    dispatch(setLoadingPlans(_id));
    dispatch(reopenPlan(_id))
      .finally(() => {
        dispatch(setLoadingPlans(_id));
      });
  };
  
  return (
    <div className={styles.ModalWrapper}>
      <h3 className={styles.ModalTitle}>{name}</h3>
      
      {eventDate && !isClosed && <span className={styles.ModalEventDate}>{format(new Date(eventDate), 'dd.MM.yyyy')}</span>}
      
      {isClosed && <h4 className={styles.ModalEventIsOver}>{t('eventIsOver')}</h4>}
      
      {isPaymentRequired && !isClosed && (
        <>
          <h4 className={styles.ModalSubTitle}>{t('progress')}</h4>
          <ProgressBarWithUserPayment
            total={paymentAmount as number}
            current={currentPayment}
            participantPayments={participantPayments}
            currency={neighborhood.currency}
            withoutText
            big
          />
          
          <p className={styles.ModalPaymentProgressText}>
            {`${plan.currentPayment} ${CurrencySymbolEnum[plan.neighborhood.currency]} / ${plan.paymentAmount} ${CurrencySymbolEnum[plan.neighborhood.currency]}`}
          </p>
          
          <div className="mt-16">
            <PlanPaymentForm plan={plan}/>
          </div>
        </>
      )}
      
      <h4 className={styles.ModalSubTitle}>{t('description')}</h4>
      <div className={styles.ModalDialogue}>
        <div className={styles.ModalDialogueTitleWrapper}>
          <h4 className={styles.ModalAuthorName}>{author.fullName}</h4>
          <span className={styles.ModalCreatedAt}>{format(new Date(createdAt), 'dd.MM.yyyy')}</span>
        </div>
        <p className={styles.ModalDescription}>{description}</p>
      </div>
      
      <h4 className={styles.ModalSubTitle}>{t('participants')}</h4>
      <ParticipantsTable
        currency={neighborhood.currency}
        participantPayments={participantPayments}
        isPaymentRequired={isPaymentRequired}
        total={paymentAmount}
      />
      
      {tasksList && (
        <>
          <h4 className={styles.ModalSubTitle}>{t('additionalTasks')}</h4>
          <PlanTasks
            tasks={tasksList}
            participants={participants}
            planId={_id}
            isClosed={isClosed}
          />
        </>
      )}
      
      {!isClosed && user?._id === author._id && (
        <div className='mt-16'>
          <Button
            text={t('endEvent')}
            onClick={handleClosePlan}
            disabled={isLoading}
            isDanger
          />
        </div>
      )}
      
      {isClosed && user?._id === author._id && (
        <div className='mt-16'>
          <Button
            text={t('reopenEvent')}
            disabled={isLoading}
            onClick={handleReopenPlan}
          />
        </div>
      )}
    </div>
  );
};

export default PlanModal;
