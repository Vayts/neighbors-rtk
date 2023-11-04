import React from 'react';
import Skeleton from 'react-loading-skeleton';
import styles from './DebtsAsideSkeleton.module.scss';

const DebtsAsideSkeleton: React.FC = () => {
  return (
    <div className={styles.AsideSkeleton}>
      <Skeleton height={30}/>
      <div className={styles.AsideContent}>
        <div className={styles.AsideRow}>
          <div className={styles.AsideCol}>
            <Skeleton/>
          </div>
          <Skeleton circle height={25} width={25}/>
          <div className={styles.AsideCol}>
            <Skeleton/>
          </div>
          <div className={styles.AsideCol}>
            <Skeleton/>
          </div>
          <div className={styles.AsideCol}>
            <Skeleton/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtsAsideSkeleton;
