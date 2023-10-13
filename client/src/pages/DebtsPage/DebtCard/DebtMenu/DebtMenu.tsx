import React, { useState } from 'react';
import { IDebt } from '@src/types/debt.types';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@src/hooks/hooks';
import cn from 'classnames';
import Modal from '@src/components/Modal/Modal';
import DeleteModal from '@src/components/DeleteModal/DeleteModal';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '@src/store/auth/selectors';
import { deleteDebt } from '@src/store/debts/thunks';
import styles from './DebtMenu.module.scss';

type Props = {
  debt: IDebt
}

const DebtMenu: React.FC<Props> = ({ debt }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const author = useAppSelector((state) => state.debtors.entities[debt.author]);
  const isAuthor = user?._id === author._id;
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
            action={deleteDebt}
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
