import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@src/hooks/hooks';
import cn from 'classnames';
import Modal from '@src/components/Modal/Modal';
import DeleteModal from '@src/components/DeleteModal/DeleteModal';
import { useNavigate } from 'react-router-dom';
import { IPlan } from '@src/types/plan.types';
import { addParticipantToPlan, deletePlan, removeParticipantFromPlan } from '@src/store/plans/thunks';
import ParticipantManager from '@src/components/ParticipantManager/ParticipantManager';
import styles from './PlanMenu.module.scss';

type Props = {
  plan: IPlan,
}

const PlanMenu: React.FC<Props> = ({ plan }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isParticipantManagerOpen, setParticipantManagerOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  const handleToggleModal = () => {
    setIsDeleteOpen(!isDeleteOpen);
  };
  
  const handleToggleParticipantModal = () => {
    setParticipantManagerOpen(!isParticipantManagerOpen);
  };
  
  const handleEdit = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    navigate(`/plans/edit/${plan._id}`);
  };
  
  const handleAddParticipantToPlan = (participantId: string) => {
    dispatch(addParticipantToPlan({
      planId: plan._id,
      participantId,
    }));
  };
  
  const handleRemoveParticipantFromPlan = (participantId: string) => {
    dispatch(removeParticipantFromPlan({
      planId: plan._id,
      participantId,
    }));
  };
  
  return (
    <>
      {isParticipantManagerOpen && (
        <Modal
          withCloseIcon
          outsideHandler={handleToggleParticipantModal}
          closeFunc={handleToggleParticipantModal}
        >
          <ParticipantManager
            participants={plan.participants}
            neighborhoodId={plan.neighborhood._id}
            onParticipantAdd={handleAddParticipantToPlan}
            onParticipantRemove={handleRemoveParticipantFromPlan}
          />
        </Modal>
      )}
      {isDeleteOpen && (
        <Modal withCloseIcon outsideHandler={handleToggleModal}>
          <DeleteModal
            itemId={plan._id}
            action={deletePlan}
            text={t('deletePlanText')}
            onClose={handleToggleModal}
          />
        </Modal>
      )}
      <ul className={styles.PlanMenuList}>
        
        {!plan.isClosed && <li className={styles.PlanMenuItem} onClick={handleEdit}>{t('edit')}</li>}
        <li className={styles.PlanMenuItem} onClick={handleToggleParticipantModal}>{t('participants')}</li>
        <li
          className={cn(styles.PlanMenuItem, styles.PlanMenuItemDanger)}
          onClick={handleToggleModal}
        >
          {t('delete')}
        </li>
        
      </ul>
    </>
  );
};

export default PlanMenu;
