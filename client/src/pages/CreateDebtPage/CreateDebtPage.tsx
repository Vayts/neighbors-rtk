import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import BackButton from '@src/components/BackButton/BackButton';
import Select from '@src/components/UI/Select/Select';
import TextArea from '@src/components/UI/TextArea/TextArea';
import { useTranslation } from 'react-i18next';
import { ICreateDebt } from '@src/types/debt.types';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import { getSelectArrFromNeighborhoods } from '@helpers/neighborhood.helper';
import { getCreateDebtDto, getSelectArrFromNeighborhoodMembers } from '@helpers/debts.helper';
import { CustomDateEventChange } from '@src/types/default.types';
import Button from '@src/components/UI/Button/Button';
import { getCreateDebtValidation } from '@src/validation/createDebt.validation';
import DateInput from '@src/components/UI/DateInput/DateInput';
import Input from '@src/components/UI/Input/Input';
import { useNavigate, useParams } from 'react-router-dom';
import { createDebt } from '@src/store/debts/thunks';
import { selectUser } from '@src/store/auth/selectors';
import { selectAllNeighborhoods } from '@src/store/userNeighborhoods/selectors';
import { useScrollTopOnMount } from '@src/hooks/useScrollTopOnMount';
import styles from './CreateDebtPage.module.scss';

const initialValues: ICreateDebt = {
  debtAmount: '',
  debtor_id: '',
  dueDate: null,
  neighborhood_id: '',
  text: '',
  errors: {},
};

const CreateDebtPage: React.FC = () => {
  useScrollTopOnMount();
  const { id } = useParams();
  const [values, setValues] = useState<ICreateDebt>({
    ...initialValues,
    neighborhood_id: id || '',
    errors: getCreateDebtValidation(initialValues),
  });
  const neighborhoods = useAppSelector(selectAllNeighborhoods);
  const user = useAppSelector(selectUser);
  const [isLoading, setLoading] = useState(false);
  
  const neighborhood = useAppSelector((state) => state.userNeighborhoods.entities[values.neighborhood_id]);
  const neighborhoodsSelectArr = useMemo(() => getSelectArrFromNeighborhoods(neighborhoods), [neighborhoods]);
  const members = useAppSelector((state) => state.members.entities);
  const membersSelectArr = useMemo(() => getSelectArrFromNeighborhoodMembers(neighborhood, members, user?._id),
    [neighborhood, members, user]);
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  useEffect(() => {
    setValues((prev) => {
      const newState = {
        ...prev,
        debtor_id: '',
      };
      
      return {
        ...newState,
        errors: getCreateDebtValidation(newState),
      };
    });
  }, [values.neighborhood_id]);
  
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | CustomDateEventChange) => {
    const { name, value } = e.target;
    
    setValues((prev) => {
      const newState = {
        ...prev,
        [name]: value,
      };
      
      return {
        ...newState,
        errors: getCreateDebtValidation(newState),
      };
    });
  }, []);
  
  const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!Object.values(values.errors).length) {
      const dto = getCreateDebtDto(values);
      setLoading(true);
      dispatch(createDebt(dto))
        .then(() => {
          navigate(`/debts${id ? `/${id}` : ''}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  
  return (
    <div className={styles.CreateDebtPageWrapper}>
      <div className={styles.CreateDebtFormWrapper}>
        <div className={styles.CreateDebtTitleWrapper}>
          <div className={styles.CreateDebtBack}>
            <BackButton/>
          </div>
          <h3 className={styles.CreateDebtTitle}>{t('createDebt')}</h3>
        </div>
        <form className={styles.CreateDebtForm}>
          <div className={styles.CreateSelectWrapper}>
            <Select
              value={values.neighborhood_id}
              onChange={handleChange}
              name='neighborhood_id'
              label={t('neighborhood')}
              placeholder={t('selectNeighborhood')}
              valuesArr={neighborhoodsSelectArr}
              isInvalid={Boolean(values.errors?.neighborhood_id)}
              error={values.errors?.neighborhood_id}
            />
          </div>
          <div className={styles.CreateSelectWrapper}>
            <Select
              value={values.debtor_id}
              onChange={handleChange}
              name='debtor_id'
              label={t('debtor')}
              placeholder={t('selectDebtor')}
              valuesArr={membersSelectArr}
              isInvalid={Boolean(values.errors?.debtor_id)}
              error={values.errors?.debtor_id}
              disabled={Boolean(!values.neighborhood_id) || Boolean(!membersSelectArr.length)}
            />
          </div>
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
              text={t('create')}
              disabled={Boolean(Object.values(values.errors).length) || isLoading}
            />
          </div>
        </form>
      </div>
    
    </div>
  );
};

export default CreateDebtPage;
