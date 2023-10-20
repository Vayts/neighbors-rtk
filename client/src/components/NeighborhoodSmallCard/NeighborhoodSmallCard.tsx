import React from 'react';
import { INeighborhood } from '@src/types/neighborhood.types';
import styles from './NeighborhoodSmallCard.module.scss';

type Props = {
  neighborhood: INeighborhood,
}

const NeighborhoodSmallCard: React.FC<Props> = ({ neighborhood }) => {
  const { name, avatar } = neighborhood;
  
  return (
    <div className={styles.NeighborhoodWrapper}>
      {!avatar && (
        <div className={styles.NeighborhoodAvatarFiller}>
          <span className='icon-neighborhoods'/>
        </div>
      )}
      <h3 className={styles.NeighborhoodName}>{name}</h3>
    </div>
  );
};

export default NeighborhoodSmallCard;
