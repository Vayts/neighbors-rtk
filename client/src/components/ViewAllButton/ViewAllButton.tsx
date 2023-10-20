import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';
import styles from './ViewAllButton.module.scss';

type Props = {
  link: string,
}

const ViewAllButton: React.FC<Props> = ({ link }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleClick = () => {
    navigate(link);
  };
  
  return (
    <div className={styles.ButtonWrapper} onClick={handleClick}>
      <div className={styles.ButtonContent}>
        <span className={styles.ButtonText}>{t('viewAll')}</span>
        <span className={cn(styles.ButtonIcon, 'icon-right')}/>
      </div>
    </div>
  );
};

export default ViewAllButton;
