import React from 'react';
import { STATIC_HREF } from '@constants/core';
import { CurrencySymbolEnum } from '@src/types/default.types';
import { IDebtTopItem } from '@src/types/debt.types';
import { useAppSelector } from '@src/hooks/hooks';
import { IMember } from '@src/types/user.types';
import styles from './DebtsTopRow.module.scss';

type Props = {
  topItem: IDebtTopItem,
  index: number,
}

const DebtsTopRow: React.FC<Props> = ({ topItem, index }) => {
  const { amount } = topItem;
  const neighborhood = useAppSelector((state) => state.neighborhoods.entities[topItem.neighborhood]);
  const user: IMember = useAppSelector((state) => state.debtors.entities[topItem.user]);
  
  return (
    <tr className={styles.DebtsTopRow}>
      <td>{index + 1}</td>
      <td>
        <img
          src={`${STATIC_HREF}/${user.avatar}`}
          className={styles.DebtsTopAvatar}
          alt={`${user.fullName} avatar`}
        />
      </td>
      <td>
        <p>
          {user.fullName}
        </p>
      </td>
      <td>
        <p>
          {neighborhood.name}
        </p>
      </td>
      <td>{`${amount} ${CurrencySymbolEnum[neighborhood.currency]}`}</td>
    </tr>
  );
};

export default DebtsTopRow;
