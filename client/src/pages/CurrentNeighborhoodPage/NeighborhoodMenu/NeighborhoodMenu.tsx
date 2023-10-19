import React, { useState } from 'react';
import { ICurrentNeighborhood, NeighborhoodRoleEnum } from '@src/types/neighborhood.types';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import DeleteNeighborhoodModal from '@src/pages/CurrentNeighborhoodPage/DeleteNeighborhoodModal/DeleteNeighborhoodModal';
import Modal from '@src/components/Modal/Modal';
import { useAppDispatch } from '@src/hooks/hooks';
import { leaveFromNeighborhood } from '@src/store/currentNeighborhood/thunks';
import { errorManager } from '@helpers/errors.helper';
import { ErrorEnum } from '@src/types/default.types';
import styles from './NeighborhoodMenu.module.scss';

type Props = {
  neighborhood: ICurrentNeighborhood,
}

const NeighborhoodMenu: React.FC<Props> = ({ neighborhood }) => {
  const [isLoading, setLoading] = useState(false);
  const [isInDelete, setIsInDelete] = useState(false);
  const isAdmin = neighborhood.role === NeighborhoodRoleEnum.admin;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  const handleNavigateToEdit = () => {
    navigate(`/neighborhoods/edit/${neighborhood._id}`);
  };
  
  const handleOpenDeleteModal = () => {
    setIsInDelete(true);
  };
  
  const handleCloseDeleteModal = () => {
    setIsInDelete(false);
  };
  
  const handleLeaveNeighborhood = () => {
    if (!isLoading) {
      setLoading(true);
      dispatch(leaveFromNeighborhood(neighborhood._id))
        .unwrap()
        .then(() => {
          navigate('/neighborhoods');
        })
        .catch((e) => {
          errorManager(e, ErrorEnum.neighborhood);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  
  return (
    <>
      {isInDelete && (
        <Modal
          outsideHandler={handleCloseDeleteModal}
          withCloseIcon
        >
          <DeleteNeighborhoodModal neighborhood={neighborhood} onClose={handleCloseDeleteModal}/>
        </Modal>
      )}
      <ul className={styles.MenuList}>
        {isAdmin && (
          <>
            <li className={styles.MenuItem} onClick={handleNavigateToEdit}>{t('edit')}</li>
            <li className={cn(styles.MenuItem, styles.MenuItemDanger)} onClick={handleOpenDeleteModal}>{t('deleteNeighborhood')}</li>
          </>
        )}
        {!isAdmin && <li className={cn(styles.MenuItem, styles.MenuItemDanger)} onClick={handleLeaveNeighborhood}>{t('leaveNeighborhood')}</li>}
      </ul>
    </>
  );
};

export default NeighborhoodMenu;
