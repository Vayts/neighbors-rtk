import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@src/components/UI/Button/Button';
import NeighborhoodsBanner from '@src/pages/NeighborhoodsPage/NeighborhoodsBanner/NeighborhoodsBanner';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import NeighborhoodsList from '@src/pages/NeighborhoodsPage/NeighborhoodsList/NeighborhoodsList';
import Loader from '@src/components/Loader/Loader';
import Modal from '@src/components/Modal/Modal';
import NeighborhoodsInviteModal from '@src/pages/NeighborhoodsPage/NeighborhoodsInviteModal/NeighborhoodsInviteModal';
import NeighborhoodSwitcher from '@src/components/NeighborhoodSwitcher/NeighborhoodSwitcher';
import { getUserNeighborhoods } from '@src/store/userNeighborhoods/thunks';
import styles from './NeighborhoodsPage.module.scss';

const NeighborhoodsPage: React.FC = () => {
  const [isInviteOpen, setInviteOpen] = useState(false);
  const neighborhoods = useAppSelector((state) => state.userNeighborhoods.ids);
  const isLoading = useAppSelector((state) => state.userNeighborhoods.isLoading);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  useEffect(() => {
    if (!neighborhoods.length) {
      dispatch(getUserNeighborhoods());
    }
  }, []);
  
  const handleNavigateToCreate = () => {
    navigate('/neighborhoods/create');
  };
  
  const toggleInviteModal = () => {
    setInviteOpen(!isInviteOpen);
  };
  
  return (
    <div className={styles.NeighborhoodsWrapper}>
      {isInviteOpen && (
        <Modal outsideHandler={toggleInviteModal} withCloseIcon>
          <NeighborhoodsInviteModal setInviteOpen={setInviteOpen}/>
        </Modal>
      )}
      <div className={styles.NeighborhoodsControls}>
        <div className={styles.NeighborhoodsTitleWrapper}>
          <h3>{t('neighborhoods')}</h3>
          <NeighborhoodSwitcher link="/neighborhoods"/>
        </div>
        <div className={styles.NeighborhoodsButtons}>
          <span
            className={styles.NeighborhoodJoinButton}
            onClick={toggleInviteModal}
          >
            {t('join')}
          </span>
          <Button
            onClick={handleNavigateToCreate}
            text={t('createNeighborhoods')}
            icon='icon-plus'
          />
        </div>
      </div>
      {isLoading && <Loader/>}
      {Boolean(!neighborhoods.length) && !isLoading && <NeighborhoodsBanner setInviteOpen={setInviteOpen}/>}
      <div className="p-16">
        <NeighborhoodsList/>
      </div>
    </div>
  );
};

export default NeighborhoodsPage;
