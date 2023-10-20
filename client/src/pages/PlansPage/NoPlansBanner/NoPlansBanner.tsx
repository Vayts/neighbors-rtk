import React from 'react';
import Button from '@src/components/UI/Button/Button';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { STATIC_HREF } from '@constants/core';
import styles from './NoPlansBanner.module.scss';

const NoPlansBanner: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleNavigateToCreate = () => {
    if (!id) {
      navigate('/plans/create');
    } else {
      navigate(`/plans/create/${id}`);
    }
  };
  
  return (
    <div className={styles.NoPlansBannerWrapper}>
      <div className={styles.NoPlansBannerContent}>
        <h3 className={styles.NoPlansBannerTitle}>{t('noPlansBannerText')}</h3>
        <img className={styles.NoPlansBannerImg} src={`${STATIC_HREF}/banner7.png`} alt='no neighborhoods banner'/>
        <p className={styles.NoPlansBannerText}>{t('noPlansText')}</p>
        <div className={styles.NoPlansBannerButtons}>
          <Button
            onClick={handleNavigateToCreate}
            text={t('createPlan')}
          />
        </div>
      </div>
    </div>
  );
};

export default NoPlansBanner;
