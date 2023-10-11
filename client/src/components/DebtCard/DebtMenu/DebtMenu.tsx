import React, { useState } from 'react';
import { IDebt } from '@src/types/debt.types';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@src/hooks/hooks';
import { selectUser } from '@src/store/user/selectors';
import cn from 'classnames';
import Modal from '@src/components/Modal/Modal';
import DeleteModal from '@src/components/DeleteModal/DeleteModal';
import { deleteDebtRequest } from '@src/store/debts/actions';
import { useNavigate } from 'react-router-dom';
import styles from './DebtMenu.module.scss';

type Props = {
  debt: IDebt
}

const DebtMenu: React.FC<Props> = ({ debt }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const isAuthor = user?._id === debt.author._id;
  const isClosed = debt.debtAmount <= debt.repaidAmount;
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
    navigate(`/debts/edit/${debt._id}`);
  };
  
  return (
    <>
      {isDeleteOpen && (
        <Modal withCloseIcon outsideHandler={handleToggleModal}>
          <DeleteModal
            itemId={debt._id}
            action={deleteDebtRequest}
            text={t('deleteDebtText')}
            onClose={handleToggleModal}
          />
        </Modal>
      )}
      <ul className={styles.DebtMenuList}>
        
        {isAuthor && !isClosed && (
          <li className={styles.DebtMenuItem} onClick={handleEdit}>{t('edit')}</li>
        )}
        
        {isAuthor && (
          <li
            className={cn(styles.DebtMenuItem, styles.DebtMenuItemDanger)}
            onClick={handleOpenModal}
          >
            {t('delete')}
          </li>
        )}
        
      </ul>
    </>
  );
};

export default DebtMenu;
