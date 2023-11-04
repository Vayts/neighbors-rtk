import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@src/hooks/hooks';
import cn from 'classnames';
import Modal from '@src/components/Modal/Modal';
import DeleteModal from '@src/components/DeleteModal/DeleteModal';
import { useNavigate } from 'react-router-dom';
import { IDuty } from '@src/types/duty.types';
import { addParticipantToDuty, deleteDuty, removeParticipantFromDuty } from '@src/store/duties/thunks';
import ParticipantManager from '@src/components/ParticipantManager/ParticipantManager';
import styles from './DutyMenu.module.scss';

type Props = {
  duty: IDuty
}

const DutyMenu: React.FC<Props> = ({ duty }) => {
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isParticipantManagerOpen, setParticipantManagerOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  const handleToggleDeleteModal = () => {
    setDeleteOpen(!isDeleteOpen);
  };
  
  const handleEdit = () => {
    navigate(`/duties/edit/${duty._id}`);
  };
  
  const handleToggleParticipantModal = () => {
    setParticipantManagerOpen(!isParticipantManagerOpen);
  };
  
  const handleAddParticipantToDuty = (participantId: string) => {
    dispatch(addParticipantToDuty({
      dutyId: duty._id,
      participantId,
    }));
  };
  
  const handleRemoveParticipantFromDuty = (participantId: string) => {
    dispatch(removeParticipantFromDuty({
      dutyId: duty._id,
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
            participants={duty.participants}
            neighborhoodId={duty.neighborhood}
            onParticipantAdd={handleAddParticipantToDuty}
            onParticipantRemove={handleRemoveParticipantFromDuty}
          />
        </Modal>
      )}
      
      {isDeleteOpen && (
        <Modal withCloseIcon outsideHandler={handleToggleDeleteModal}>
          <DeleteModal
            itemId={duty._id}
            action={deleteDuty}
            text={t('areUWantDeleteDuty')}
            onClose={handleToggleDeleteModal}
          />
        </Modal>
      )}
      <ul className={styles.DutyMenuList}>
        
        <li
          className={styles.DutyMenuItem}
          onClick={handleToggleParticipantModal}
        >
          {t('participants')}
        </li>
        <li className={styles.DutyMenuItem} onClick={handleEdit}>{t('edit')}</li>
        <li
          className={cn(styles.DutyMenuItem, styles.DutyMenuItemDanger)}
          onClick={handleToggleDeleteModal}
        >
          {t('delete')}
        </li>
        
      </ul>
    </>
  );
};

export default DutyMenu;
