import React, { memo } from 'react';
import { IPlan } from '@src/types/plan.types';
import { Tooltip } from 'react-tooltip';
import { useTranslation } from 'react-i18next';
import { Menu } from '@src/components/UI/Menu/Menu';
import { format } from 'date-fns';
import ParticipantsList from '@src/pages/PlansPage/PaticipantsList/ParticipantsList';
import ProgressBarWithUserPayment from '@src/components/ProgressBarWithUserPayment/ProgressBarWithUserPayment';
import PlanMenu from '@src/pages/PlansPage/PlanCard/PlanMenu/PlanMenu';
import { useAppSelector } from '@src/hooks/hooks';
import { IUser } from '@src/types/user.types';
import { selectUser } from '@src/store/auth/selectors';
import { STATIC_HREF } from '@constants/core';
import { selectParticipantsByIds } from '@src/store/participants/selector';
import styles from './PlanCard.module.scss';

type Props = {
  plan: IPlan,
  onClick: (plan: IPlan) => void,
}

const PlanCard: React.FC<Props> = ({ plan, onClick }) => {
  const {
    name,
    _id,
    description,
    neighborhood,
    currentPayment,
    isPaymentRequired,
    paymentAmount,
    participantPayments,
    tasksList,
    eventDate,
    isClosed,
  } = plan;
  const user = useAppSelector(selectUser) as IUser;
  const author = useAppSelector((state) => state.participants.entities[plan.author]);
  const completedTask = tasksList ? tasksList.filter((item) => item.completed).length : 0;
  const { t } = useTranslation();
  const participants = useAppSelector((state) => selectParticipantsByIds(state, plan.participants));
  const handleClick = () => {
    onClick(plan);
  };
  
  return (
    <li className={styles.PlanWrapper}>
      {author._id === user?._id && (
        <div className={styles.PlanMenuWrapper}>
          <Menu>
            <PlanMenu plan={plan}/>
          </Menu>
        </div>
      )}
      
      <div className={styles.PlanContent} onClick={handleClick}>
        <div className={styles.PlanMainContent}>
          
          <img
            data-tooltip-id={`${_id}-author-plan`}
            className={styles.PlanAuthorAvatar}
            src={`${STATIC_HREF}/${author.avatar}`}
            alt={`${author.fullName} avatar`}
          />
          
          <div className={styles.PlanTextWrapper}>
            <h4 className={styles.PlanName}>{name}</h4>
            <p className={styles.PlanDescription}>{description}</p>
          </div>
          
          <div className={styles.ParticipantsWrapper}>
            <ParticipantsList participants={participants} />
          </div>
          
        </div>
        
        <div className={styles.PlanBottomContent}>
          <div className={styles.PlanProgressBarWrapper}>
            {isPaymentRequired && !isClosed && (
              <ProgressBarWithUserPayment
                total={paymentAmount as number}
                current={currentPayment}
                participantPayments={participantPayments}
                currency={neighborhood.currency}
              />
            )}
            
            {!isPaymentRequired && !isClosed && <p className={styles.PlanNoPaymentText}>{t('noPaymentRequiredText')}</p>}
            
            {isClosed && <p className={styles.PlanEventIsOver}>{t('eventIsOver')}</p>}
          </div>
          
          <div className={styles.PlanAdditionalInfo}>
            {tasksList && (
              <>
                <div
                  className={styles.PlanCompletedTask}
                  data-tooltip-id={`${_id}-completed-task`}
                >
                  <p>{`${completedTask} / ${tasksList.length}`}</p>
                  <span className='icon-task' />
                </div>
                
                <Tooltip
                  style={{ zIndex: 7 }}
                  id={`${_id}-completed-task`}
                  place="top"
                  content={`${t('completedTaskCounter', { a: completedTask, b: tasksList.length })}`}
                />
              </>
            )}
            
            {eventDate && (
              <div className={styles.PlanEventDate}>
                <p>{format(new Date(eventDate), 'dd.MM.yyyy')}</p>
                <span className='icon-calendar'/>
              </div>
            )}
          </div>
        </div>
      
      </div>
      
      <Tooltip
        style={{ zIndex: 100 }}
        id={`${_id}-author-plan`}
        place="bottom"
        content={`${t('author')}: ${author.fullName}`}
      />
      
    </li>
  );
};

export default memo(PlanCard);
