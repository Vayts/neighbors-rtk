import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@src/components/UI/Button/Button';
import { useNavigate } from 'react-router-dom';
import { STATIC_HREF } from '@constants/core';
import styles from './NeighborhoodsBanner.module.scss';

type Props = {
  setInviteOpen: (value: boolean) => void;
}

const NeighborhoodsBanner: React.FC<Props> = ({ setInviteOpen }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleNavigate = () => {
    navigate('/neighborhoods/create');
  };
  
  const handleOpenInviteModal = () => {
    setInviteOpen(true);
  };
  
  return (
    <div className={styles.NeighborhoodsBannerWrapper}>
      <div className={styles.NeighborhoodsBannerContent}>
        <h3 className={styles.NeighborhoodsBannerTitle}>{t('zeroNeighborhoodsBannerTitle')}</h3>
        <img className={styles.NeighborhoodsBannerImg} src={`${STATIC_HREF}/banner13.png`} alt='no neighborhoods banner'/>
        <p className={styles.NeighborhoodsBannerText}>{t('zeroNeighborhoodsBannerText')}</p>
        <div className={styles.NeighborhoodsBannerButtons}>
          <Button
            onClick={handleOpenInviteModal}
            text={t('joinNeighborhood')}
          />
          <Button
            onClick={handleNavigate}
            text={t('createNeighborhoods')}
          />
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodsBanner;
