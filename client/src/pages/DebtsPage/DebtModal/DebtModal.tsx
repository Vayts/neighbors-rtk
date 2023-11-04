import React from 'react';
import { IDebt } from '@src/types/debt.types';
import { useTranslation } from 'react-i18next';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { CurrencySymbolEnum } from '@src/types/default.types';
import { Tooltip } from 'react-tooltip';
import { useAppSelector } from '@src/hooks/hooks';
import { IUser } from '@src/types/user.types';
import DateRange from '@src/components/DateRange/DateRange';
import DebtPaymentForm from '@src/pages/DebtsPage/DebtModal/DebtPaymentForm/DebtPaymentForm';
import { selectUser } from '@src/store/auth/selectors';
import { STATIC_HREF } from '@constants/core';
import styles from './DebtModal.module.scss';

type Props = {
  debt: IDebt,
}

const DebtModal: React.FC<Props> = ({ debt }) => {
  const { debtAmount, repaidAmount, dueDate, text, _id, createdAt } = debt;
  const user = useAppSelector(selectUser) as IUser;
  const neighborhood = useAppSelector((state) => state.userNeighborhoods.entities[debt.neighborhood]);
  const author = useAppSelector((state) => state.debtors.entities[debt.author]);
  const debtor = useAppSelector((state) => state.debtors.entities[debt.debtor]);
  const showForm = debt.repaidAmount < debt.debtAmount && author._id === user?._id;
  const percentage = Math.round((repaidAmount / debtAmount) * 100);
  const { t } = useTranslation();
  
  return (
    <div className={styles.ModalWrapper}>
      <h3 className={styles.ModalTitle}>{t('debt')}</h3>
      
      <div className={styles.ModalDates}>
        <DateRange end={dueDate} start={createdAt}/>
      </div>
      
      <div className={styles.ModalContent}>
        
        <div className={styles.ModalUser}>
          <p className={styles.ModalUserRole}>{t('author')}</p>
          <img
            data-tooltip-id={`${_id}-author`}
            className={styles.ModalUserAvatar}
            src={`${STATIC_HREF}/${author.avatar}`}
            alt={`${author.fullName} avatar`}
          />
        </div>
        
        <div className={styles.ModalProgress}>
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            styles={buildStyles({
              strokeLinecap: 'round',
              pathColor: '#2C9E95',
              textColor: '#2C9E95',
            })}
          />
        </div>
        
        <div className={styles.ModalUser}>
          <p className={styles.ModalUserRole}>{t('debtor')}</p>
          <img
            data-tooltip-id={`${_id}-debtor`}
            className={styles.ModalUserAvatar}
            src={`${STATIC_HREF}/${debtor.avatar}`}
            alt={`${debtor.fullName} avatar`}
          />
        </div>
      </div>
      
      <p className={styles.ModalProgressText}>
        {`${repaidAmount} ${CurrencySymbolEnum[neighborhood.currency]} / ${debtAmount} ${CurrencySymbolEnum[neighborhood.currency]}`}
      </p>
      
      <p className={styles.ModalText}>{text}</p>
      
      {showForm && <DebtPaymentForm debt={debt}/>}
      
      <Tooltip
        id={`${_id}-debtor`}
        place="bottom"
        content={`${t('debtor')}: ${debtor.fullName}`}
      />
      <Tooltip
        id={`${_id}-author`}
        place="bottom"
        content={`${t('author')}: ${author.fullName}`}
      />
    </div>
  );
};

export default DebtModal;
