import React, { useCallback } from 'react';
import { IDebt } from '@src/types/debt.types';
import { useAppSelector } from '@src/hooks/hooks';
import Modal from '@src/components/Modal/Modal';
import DebtModal from '@src/pages/DebtsPage/DebtModal/DebtModal';
import { useTranslation } from 'react-i18next';
import DebtCard from '@src/pages/DebtsPage/DebtCard/DebtCard';
import { useSearchParams } from 'react-router-dom';
import styles from './DebtsList.module.scss';

type Props = {
  visibleDebts: IDebt[]
}

const DebtsList: React.FC<Props> = ({ visibleDebts }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const debtId = searchParams.get('debt_id');
  const selectedDebt = useAppSelector((state) => state.debts.entities[debtId]);
  const { t } = useTranslation();
  
  const handleDebtClick = useCallback((debt: IDebt) => {
    setSearchParams({ debt_id: debt._id });
  }, []);
  
  const handleCloseDebtModal = () => {
    setSearchParams({});
  };
  
  return (
    <>
      {selectedDebt && (
        <Modal
          outsideHandler={handleCloseDebtModal}
          withCloseIcon
        >
          <DebtModal debt={selectedDebt} />
        </Modal>
      )}
      {!visibleDebts.length ? <p className={styles.NoDebtsInList}>{t('nothingFound')}</p> : (
        <ul className={styles.DebtsList}>
          {visibleDebts.map((item) => {
            return (
              <DebtCard
                key={item._id}
                debt={item}
                onClick={handleDebtClick}
              />
            );
          })}
        </ul>
      )}
      
    </>
  );
};

export default DebtsList;
