import React from 'react';
import Skeleton from 'react-loading-skeleton';
import cn from 'classnames';
import styles from './NeighborhoodSkeleton.module.scss';

type Props = {
  amount: number,
}

const NeighborhoodSkeleton: React.FC<Props> = ({ amount }) => {
  return (
    <div className={styles.SkeletonListWrapper}>
      {
        Array(amount).fill(0).map((_, index) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div className={styles.SkeletonWrapper} key={index}>
              <span className={cn(styles.SkeletonIcon, 'icon-star')}/>
              <div className={styles.SkeletonTitleWrapper}>
                <Skeleton circle height={40} width={40}/>
                <div className={styles.SkeletonTitle}>
                  <Skeleton/>
                </div>
              </div>
              <div className={styles.SkeletonRole}>
                <Skeleton/>
              </div>
            </div>
          );
        })
      }
    </div>
    
  );
};

export default NeighborhoodSkeleton;
