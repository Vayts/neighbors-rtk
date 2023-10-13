import React from 'react';
import { useAppSelector } from '@src/hooks/hooks';
import NeighborhoodCard from '@src/pages/NeighborhoodsPage/NeighborhoodCard/NeighborhoodCard';
import styles from './NeighborhoodsList.module.scss';

const NeighborhoodsList: React.FC = () => {
  const neighborhoods = useAppSelector((state) => state.userNeighborhoods.ids);
  
  return (
    <ul className={styles.NeighborhoodsList}>
      {neighborhoods.map((item) => <NeighborhoodCard key={item} neighborhoodId={item}/>)}
    </ul>
  );
};

export default NeighborhoodsList;
