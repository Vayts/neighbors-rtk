import React from 'react';
import { IDebtTopItem } from '@src/types/debt.types';
import DebtsTopRow from '@src/pages/DebtsPage/DebtsTop/DebtsTopRow/DebtsTopRow';
import styles from './DebtsTop.module.scss';

type Props = {
  topDebts: IDebtTopItem[],
  text: string,
}

const DebtsTop: React.FC<Props> = ({ topDebts, text }) => {
  return (
    <div className={styles.DebtsTopWrapper}>
      <h3 className={styles.DebtsTopTitle}>{text}</h3>
      <table className={styles.DebtsTopTable}>
        <tbody>
          {topDebts.map((item, index) => {
            return (
              <DebtsTopRow
                key={`${item.neighborhood}-${item.user}`}
                topItem={item}
                index={index}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DebtsTop;
