import React from 'react';
import Button from '@src/components/UI/Button/Button';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { STATIC_HREF } from '@constants/core';
import styles from './NoDebtsBanner.module.scss';

const NoDebtsBanner: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('neighborhood_id');
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleNavigateToCreate = () => {
    if (!id) {
      navigate('/debts/create');
    } else {
      navigate(`/debts/create?neighborhood_id=${id}`);
    }
  };
  
  return (
    <div className={styles.NoDebtsBannerWrapper}>
      <div className={styles.NoDebtsBannerContent}>
        <h3 className={styles.NoDebtsBannerTitle}>{t('noDebtsBannerText')}</h3>
        <img className={styles.NoDebtsBannerImg} src={`${STATIC_HREF}/banner11.png`} alt='no neighborhoods banner'/>
        <p className={styles.NoDebtsBannerText}>{t(id ? 'noDebtsOrDebtorsInNeighborhoodText' : 'noDebtsOrDebtorsText')}</p>
        <div className={styles.NoDebtsBannerButtons}>
          <Button
            onClick={handleNavigateToCreate}
            text={t('createDebt')}
          />
        </div>
      </div>
    </div>
  );
};

export default NoDebtsBanner;
