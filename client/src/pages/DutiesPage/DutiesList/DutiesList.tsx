import React from 'react';
import { useAppSelector } from '@src/hooks/hooks';
import { selectAllDuties } from '@src/store/duties/selectors';
import DutyCard from '@src/pages/DutiesPage/DutyCard/DutyCard';
import styles from './DutiesList.module.scss';

const DutiesList: React.FC = () => {
  const duties = useAppSelector(selectAllDuties);
  
  return (
    <div className={styles.DutiesList}>
      {duties.map((item) => {
        return (<DutyCard duty={item} key={item._id}/>);
      })}
    </div>
  );
};

export default DutiesList;
