import React from 'react';
import Skeleton from 'react-loading-skeleton';
import styles from './PlanSkeleton.module.scss';

type Props = {
  amount: number;
}

const PlanSkeleton: React.FC<Props> = ({ amount }) => {
  return (
    <div>
      {Array(amount).fill(0).map((_, index) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div className={styles.PlanSkeletonWrapper} key={index}>
            <div className={styles.PlanSkeletonItem}>
              <div className={styles.PlanSkeletonMenu}>
                <span className='icon-menu-dots' />
              </div>
              <div className={styles.PlanSkeletonMain}>
                <Skeleton circle height={56} width={56}/>
                <div className={styles.PlanSkeletonText}>
                  <div className={styles.PlanSkeletonTitle}>
                    <Skeleton/>
                  </div>
                  <Skeleton/>
                </div>
                <div className={styles.PlanSkeletonParticipants}>
                  <Skeleton circle height={40} width={40}/>
                  <Skeleton circle height={40} width={40}/>
                </div>
              </div>
              <div className={styles.PlanSkeletonBottom}>
                <div className={styles.PlanSkeletonProgressBar}>
                  <Skeleton/>
                </div>
                <div className={styles.PlanSkeletonDate}>
                  <Skeleton/>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlanSkeleton;
