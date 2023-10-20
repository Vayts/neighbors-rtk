import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@src/hooks/hooks';
import cn from 'classnames';
import Modal from '@src/components/Modal/Modal';
import DeleteModal from '@src/components/DeleteModal/DeleteModal';
import { useNavigate } from 'react-router-dom';
import { IPlan } from '@src/types/plan.types';
import { selectUser } from '@src/store/auth/selectors';
import { deletePlan } from '@src/store/plans/thunks';
import styles from './PlanMenu.module.scss';

type Props = {
  plan: IPlan,
}

const PlanMenu: React.FC<Props> = ({ plan }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const { t } = useTranslation();
  
  const handleToggleModal = () => {
    setIsDeleteOpen(!isDeleteOpen);
  };
  
  const handleOpenModal = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsDeleteOpen(true);
  };
  
  const handleEdit = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    navigate(`/plans/edit/${plan._id}`);
  };
  
  return (
    <>
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
        
        {user?._id === plan.author && (
          <>
            {!plan.isClosed && <li className={styles.PlanMenuItem} onClick={handleEdit}>{t('edit')}</li>}
            <li
              className={cn(styles.PlanMenuItem, styles.PlanMenuItemDanger)}
              onClick={handleOpenModal}
            >
              {t('delete')}
            </li>
          </>
        )}
        
      </ul>
    </>
  );
};

export default PlanMenu;
