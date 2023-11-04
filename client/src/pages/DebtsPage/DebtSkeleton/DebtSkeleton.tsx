import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { Menu } from '@src/components/UI/Menu/Menu';
import styles from './DebtSkeleton.module.scss';

type Props = {
  amount: number;
}

const DebtSkeleton: React.FC<Props> = ({ amount }) => {
  return (
    <div>
      {Array(amount).fill(0).map((_, index) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div className={styles.DebtSkeleton} key={index}>
            <div className={styles.DebtMenuWrapper}>
              <Menu><Skeleton/></Menu>
            </div>
            <div className={styles.DebtMainContent}>
              <div className={styles.DebtSkeletonAvatars}>
                <Skeleton circle height={56} width={56}/>
                <Skeleton circle height={46} width={46}/>
              </div>
              <div className={styles.DebtTitle}>
                <Skeleton/>
              </div>
            </div>
            <div className={styles.DebtBottomContent}>
              <Skeleton/>
              <Skeleton/>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DebtSkeleton;
