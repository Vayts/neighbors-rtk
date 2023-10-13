import React, { ChangeEvent, useCallback, useState } from 'react';
import BackButton from '@src/components/BackButton/BackButton';
import { useTranslation } from 'react-i18next';
import Input from '@src/components/UI/Input/Input';
import { ICreateNeighborhood } from '@src/types/neighborhood.types';
import { getCreateNeighborhoodValidation } from '@src/validation/createNeighborhood.validation';
import TextArea from '@src/components/UI/TextArea/TextArea';
import Button from '@src/components/UI/Button/Button';
import { useAppDispatch } from '@src/hooks/hooks';
import { useNavigate } from 'react-router-dom';
import Select from '@src/components/UI/Select/Select';
import { createNeighborhood } from '@src/store/userNeighborhoods/thunks';
import { CURRENT_CURRENCIES } from '@constants/core';
import styles from './CreateNeighborhoodPage.module.scss';

const initialValues: ICreateNeighborhood = {
  name: '',
  currency: '',
  description: '',
  errors: {},
};

const CreateNeighborhoodPage: React.FC = () => {
  const [values, setValues] = useState<ICreateNeighborhood>({
    ...initialValues,
    errors: getCreateNeighborhoodValidation(initialValues),
  });
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setValues((prev) => {
      const newState = {
        ...prev,
        [name]: value,
      };
      
      return {
        ...newState,
        errors: getCreateNeighborhoodValidation(newState),
      };
    });
  }, []);
  
  const handleSubmit = () => {
    if (!Object.values(values.errors).length) {
      setLoading(true);
      dispatch(createNeighborhood(values))
        .then(() => {
          navigate('/neighborhoods');
        })
        .finally(() => {
          setLoading(true);
        });
    }
  };
  
  return (
    <div className={styles.CreateNeighborhoodPageWrapper}>
      <div className={styles.CreateNeighborhoodFormWrapper}>
        <div className={styles.CreateNeighborhoodTitleWrapper}>
          <div className={styles.CreateNeighborhoodBack}>
            <BackButton/>
          </div>
          <h3 className={styles.CreateNeighborhoodTitle}>{t('createNeighborhoods')}</h3>
        </div>
        <form className={styles.CreateNeighborhoodForm}>
          <div className={styles.CreateSelectWrapper}>
            <Select
              value={values.currency}
              onChange={handleChange}
              name='currency'
              label={t('currency')}
              placeholder={t('selectCurrency')}
              valuesArr={CURRENT_CURRENCIES}
              isInvalid={Boolean(values.errors?.currency)}
              error={values.errors?.currency}
            />
          </div>
          <div className="mb-16">
            <Input
              onChange={handleChange}
              value={values.name}
              name='name'
              label={t('neighborhoodName')}
              placeholder={t('enterName')}
              error={values.errors?.name}
              isInvalid={Boolean(values.errors?.name)}
            />
          </div>
          <div className="mb-32">
            <TextArea
              onChange={handleChange}
              value={values.description}
              name='description'
              label={t('neighborhoodDescription')}
              placeholder={t('enterDescription')}
              error={values.errors?.description}
              isInvalid={Boolean(values.errors?.description)}
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

export default CreateNeighborhoodPage;
