import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import Input from '@src/components/UI/Input/Input';
import Button from '@src/components/UI/Button/Button';
import { useTranslation } from 'react-i18next';
import { IDebt } from '@src/types/debt.types';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import { IAddPayment } from '@src/types/payment.types';
import { getAddPaymentValidation } from '@src/validation/payments.validation';
import { addDebtPayment, closeDebt } from '@src/store/debts/thunks';
import { setLoadingDebts } from '@src/store/debts/slice';
import styles from './DebtPaymentForm.module.scss';

type Props = {
  debt: IDebt,
}

const initialValues = {
  amount: '',
  errors: {},
};

const DebtPaymentForm: React.FC<Props> = ({ debt }) => {
  const [values, setValues] = useState<IAddPayment>(initialValues);
  const [isInClose, setInClose] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const loadingTodos = useAppSelector((state) => state.debts.loadingItems);
  const isLoading = loadingTodos.includes(debt._id);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setValues((prev) => {
      const newState = {
        ...prev,
        [name]: value,
      };
      
      return {
        ...newState,
        errors: getAddPaymentValidation(newState, debt.debtAmount, debt.repaidAmount),
      };
    });
  }, []);
  
  const handleAddPayment = (e: React.FormEvent) => {
    setValues(initialValues);
    e.preventDefault();
    dispatch(setLoadingDebts(debt._id));
    dispatch(addDebtPayment({ id: debt._id, amount: values.amount }))
      .finally(() => {
        dispatch(setLoadingDebts(debt._id));
      });
  };
  
  const handleToggleCloseDebtWindow = () => {
    setInClose(!isInClose);
  };
  
  const handleCloseDebt = () => {
    dispatch(setLoadingDebts(debt._id));
    dispatch(closeDebt(debt._id))
      .unwrap()
      .then(() => {
        setInClose(!isInClose);
      })
      .finally(() => {
        dispatch(setLoadingDebts(debt._id));
      });
  };
  
  return (
    <form onSubmit={handleAddPayment}>
      {!isInClose && (
        <>
          <div className="mb-16">
            <Input
              onChange={handleChange}
              value={values.amount}
              name='amount'
              label={t('paymentAmount')}
              placeholder={t('enterPaymentAmount')}
              error={values.errors?.amount}
              isInvalid={Boolean(values.errors?.amount)}
              refValue={inputRef}
            />
          </div>
          <div className={styles.ModalButtons}>
            <Button
              text={t('closeDebt')}
              onClick={handleToggleCloseDebtWindow}
              isDanger
              disabled={isLoading}
            />
            <Button
              text={t('addPayment')}
              onClick={handleAddPayment}
              disabled={Boolean(Object.keys(values.errors).length) || !values.amount || isLoading}
            />
          </div>
        </>
      )}
      
      {isInClose && (
        <div className={styles.ModalCloseContent}>
          <h3 className={styles.ModalConfirmCloseTitle}>{t('areYouSure')}</h3>
          <p className={styles.ModalConfirmCloseText}>{t('closeDebtText')}</p>
          <div className={styles.ModalButtons}>
            <Button
              text={t('confirm')}
              onClick={handleCloseDebt}
              disabled={isLoading}
              type='submit'
            />
            <Button
              text={t('cancel')}
              onClick={handleToggleCloseDebtWindow}
              disabled={isLoading}
              isDanger
            />
          </div>
        </div>
      )}
    </form>
  );
};

export default DebtPaymentForm;
