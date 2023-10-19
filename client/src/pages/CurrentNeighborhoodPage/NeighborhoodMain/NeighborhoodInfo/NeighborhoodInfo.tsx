import React from 'react';
import { useAppSelector } from '@src/hooks/hooks';
import { INeighborhood } from '@src/types/neighborhood.types';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import styles from './NeighborhoodInfo.module.scss';

const NeighborhoodInfo: React.FC = () => {
  const neighborhood = useAppSelector((state) => state.currentNeighborhood.neighborhood);
  const { name, description, _id } = neighborhood as INeighborhood;
  const { t } = useTranslation();
  
  return (
    <div className={styles.InfoWrapper}>
      <div className={styles.InfoContent}>
        <div className={styles.InfoAvatarFiller}>
          <span className='icon-neighborhoods'/>
        </div>
        <div className={styles.InfoTextWrapper}>
          <h3 className={styles.InfoName}>{name}</h3>
          <p className={styles.InfoDescription}>{description}</p>
        </div>
      </div>
      <nav className={styles.InfoNavigation}>
        <NavLink to={`/debts/${_id}`} className={styles.InfoNavigationItem}>
          {`${t('debts')}: ${neighborhood.debts}`}
        </NavLink>
        <NavLink to={`/plans/${_id}`} className={styles.InfoNavigationItem}>
          {`${t('plans')}: ${neighborhood.plans}`}
        </NavLink>
      </nav>
    </div>
  );
};

export default NeighborhoodInfo;
