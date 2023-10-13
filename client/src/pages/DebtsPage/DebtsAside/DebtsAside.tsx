import React, { useMemo } from 'react';
import { useAppSelector } from '@src/hooks/hooks';
import { getDebtTop } from '@helpers/debts.helper';
import DebtsTop from '@src/pages/DebtsPage/DebtsTop/DebtsTop';
import { useTranslation } from 'react-i18next';
import { IUser } from '@src/types/user.types';
import { selectUser } from '@src/store/auth/selectors';
import { selectAllDebts } from '@src/store/debts/selectors';
import styles from './DebtsAside.module.scss';

const DebtsAside: React.FC = () => {
  const debts = useAppSelector(selectAllDebts);
  const user = useAppSelector(selectUser) as IUser;
  const topDebtors = useMemo(() => getDebtTop(debts, user._id, 'debtor'), [debts]);
  const topAuthors = useMemo(() => getDebtTop(debts, user._id, 'author'), [debts]);
  const { t } = useTranslation();
  
  return (
    <div className={styles.AsideWrapper}>
      {Boolean(topDebtors.length) && (
        <div className="mb-16">
          <DebtsTop topDebts={topDebtors} text={t('debtorsTableText')}/>
        </div>
      )}
      {Boolean(topAuthors.length) && (
        <div className="mb-16">
          <DebtsTop topDebts={topAuthors} text={t('yourDebtsTableText')}/>
        </div>
      )}
    </div>
  );
};

export default DebtsAside;
