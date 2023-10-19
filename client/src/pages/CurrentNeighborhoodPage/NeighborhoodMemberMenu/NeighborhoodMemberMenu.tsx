import React, { useState } from 'react';
import Modal from '@src/components/Modal/Modal';
import DeleteModal from '@src/components/DeleteModal/DeleteModal';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { IMember } from '@src/types/user.types';
import { deleteUserFromNeighborhood } from '@src/store/currentNeighborhood/thunks';
import styles from './NeighborhoodMemberMenu.module.scss';

type Props = {
  member: IMember,
}

const NeighborhoodMemberMenu: React.FC<Props> = ({ member }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { t } = useTranslation();
  
  const handleToggleModal = () => {
    setIsDeleteOpen(!isDeleteOpen);
  };
  
  const handleOpenModal = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsDeleteOpen(true);
  };
  
  return (
    <>
      {isDeleteOpen && (
        <Modal withCloseIcon outsideHandler={handleToggleModal}>
          <DeleteModal
            itemId={member._id}
            action={deleteUserFromNeighborhood}
            text={t('deleteDebtText')}
            onClose={handleToggleModal}
          />
        </Modal>
      )}
      <ul className={styles.MemberMenuList}>
        
        <li
          className={cn(styles.MemberMenuItem, styles.MemberMenuItemDanger)}
          onClick={handleOpenModal}
        >
          {t('delete')}
        </li>
      
      </ul>
    </>
  );
};

export default NeighborhoodMemberMenu;
