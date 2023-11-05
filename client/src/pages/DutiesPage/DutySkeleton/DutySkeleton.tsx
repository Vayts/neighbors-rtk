import React from 'react';
import Skeleton from 'react-loading-skeleton';
import styles from './DutySkeleton.module.scss';

type Props = {
  amount: number;
}

const DutySkeleton: React.FC<Props> = ({ amount }) => {
  return (
    <div className={styles.DutiesSkeletonList}>
      {Array(amount).fill(0).map((_, index) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div className={styles.DutySkeletonWrapper} key={index}>
            <div className={styles.DutySkeletonMenu}>
              <span className='icon-menu-dots'/>
            </div>
            <div className={styles.DutySkeletonItem}>
              <div className={styles.DutySkeletonTitle}>
                <Skeleton height={20}/>
              </div>
              <Skeleton height={392}/>
              <div className={styles.DutySkeletonButton}>
                <Skeleton height={38}/>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DutySkeleton;
