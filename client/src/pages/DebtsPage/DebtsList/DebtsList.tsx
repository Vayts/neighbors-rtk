import React, { useCallback, useEffect, useState } from 'react';
import { IDebt } from '@src/types/debt.types';
import { useAppSelector } from '@src/hooks/hooks';
import Modal from '@src/components/Modal/Modal';
import DebtModal from '@src/pages/DebtsPage/DebtModal/DebtModal';
import { useTranslation } from 'react-i18next';
import { selectAllDebts } from '@src/store/debts/selectors';
import DebtCard from '@src/pages/DebtsPage/DebtCard/DebtCard';
import styles from './DebtsList.module.scss';

type Props = {
  visibleDebts: IDebt[]
}

const DebtsList: React.FC<Props> = ({ visibleDebts }) => {
  const [selectedDebt, setSelectedDebt] = useState<IDebt | null>(null);
  const debts = useAppSelector(selectAllDebts);
  const { t } = useTranslation();
  
  useEffect(() => {
    if (selectedDebt) {
      debts.forEach((item) => {
        if (item._id === selectedDebt._id) {
          setSelectedDebt(item);
        }
      });
    }
  }, [debts]);
  
  const handleDebtClick = useCallback((debt: IDebt) => {
    setSelectedDebt(debt);
  }, []);
  
  const handleCloseDebtModal = () => {
    setSelectedDebt(null);
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
