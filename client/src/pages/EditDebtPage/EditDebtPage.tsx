import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import BackButton from '@src/components/BackButton/BackButton';
import DateInput from '@src/components/UI/DateInput/DateInput';
import Input from '@src/components/UI/Input/Input';
import TextArea from '@src/components/UI/TextArea/TextArea';
import Button from '@src/components/UI/Button/Button';
import { CustomDateEventChange } from '@src/types/default.types';
import { getEditDebtValidation } from '@src/validation/createDebt.validation';
import { IDebt, IEditDebt } from '@src/types/debt.types';
import { useTranslation } from 'react-i18next';
import { getEditDebtDto } from '@helpers/debts.helper';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { editDebt } from '@src/store/debts/thunks';
import styles from './EditDebtPage.module.scss';

const EditDebtPage: React.FC = () => {
  const { debtId } = useParams();
  const debtForEdit = useAppSelector((state) => state.debts.entities[debtId]);
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get('neighborhood_id');
  const [values, setValues] = useState<IEditDebt>({
    debtAmount: debtForEdit ? debtForEdit.debtAmount.toString() : '',
    text: debtForEdit ? debtForEdit.text : '',
    errors: {},
    dueDate: debtForEdit?.dueDate ? new Date(debtForEdit.dueDate) : null,
  });
  const isLoading = useAppSelector((state) => state.debts.isLoading);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  useEffect(() => {
    if (!debtId || !debtForEdit) {
      navigate(`/debts${id ? `?neighborhood_id=${id}` : ''}`);
    }
  }, []);
  
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | CustomDateEventChange) => {
    const { name, value } = e.target;
    
    setValues((prev) => {
      const newState = {
        ...prev,
        [name]: value,
      };
      
      return {
        ...newState,
        errors: getEditDebtValidation(newState, debtForEdit as IDebt),
      };
    });
  }, []);
  
  const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!Object.values(values.errors).length) {
      const dto = getEditDebtDto(values);
      dispatch(editDebt({ id: debtId, values: dto }))
        .unwrap()
        .then(() => {
          navigate(`/debts${id ? `?neighborhood_id=${id}` : ''}`);
        });
    }
  };
  
  return (
    <div className={styles.EditDebtPageWrapper}>
      <div className={styles.EditDebtFormWrapper}>
        <div className={styles.EditDebtTitleWrapper}>
          <div className={styles.EditDebtBack}>
            <BackButton/>
          </div>
          <h3 className={styles.EditDebtTitle}>{t('editDebt')}</h3>
        </div>
        <form className={styles.EditDebtForm}>
          <div className='mb-16'>
            <DateInput
              label={`${t('debtDateRepayment')} (${t('optionalSmall')})`}
              value={values.dueDate}
              onChange={handleChange}
              name='dueDate'
              isInvalid={Boolean(values.errors?.dueDate)}
              error={values.errors?.dueDate}
              placeholder={t('selectDate')}
            />
          </div>
          <div className='mb-16'>
            <Input
              onChange={handleChange}
              value={values.debtAmount}
              name='debtAmount'
              label={t('debtAmount')}
              placeholder={t('enterAmount')}
              error={values.errors?.debtAmount}
              isInvalid={Boolean(values.errors?.debtAmount)}
            />
          </div>
          <div className="mb-32">
            <TextArea
              onChange={handleChange}
              value={values.text}
              name='text'
              label={t('text')}
              placeholder={t('enterText')}
              error={values.errors?.text}
              isInvalid={Boolean(values.errors?.text)}
            />
          </div>
          <div className="mb-16">
            <Button
              onClick={handleSubmit}
              text={t('edit')}
              disabled={Boolean(Object.values(values.errors).length) || isLoading}
            />
          </div>
        </form>
      </div>
    
    </div>
  );
};

export default EditDebtPage;
