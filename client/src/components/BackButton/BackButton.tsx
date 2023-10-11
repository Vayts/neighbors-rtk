import React from 'react';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './BackButton.module.scss';

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleClick = () => {
    navigate(-1);
  };
  
  return (
    <div className={styles.BackButtonWrapper} onClick={handleClick}>
      <div className={styles.BackButtonContent}>
        <span className={cn(styles.BackButtonIcon, 'icon-left')}/>
        <span className={styles.BackButtonText}>{t('back')}</span>
      </div>
    </div>
  );
};

export default BackButton;
