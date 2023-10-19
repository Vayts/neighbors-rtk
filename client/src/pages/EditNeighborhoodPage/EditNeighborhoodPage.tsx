import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import BackButton from '@src/components/BackButton/BackButton';
import { useTranslation } from 'react-i18next';
import Input from '@src/components/UI/Input/Input';
import { IEditNeighborhood, NeighborhoodRoleEnum } from '@src/types/neighborhood.types';
import { getCreateNeighborhoodValidation } from '@src/validation/createNeighborhood.validation';
import TextArea from '@src/components/UI/TextArea/TextArea';
import Button from '@src/components/UI/Button/Button';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import Select from '@src/components/UI/Select/Select';
import { editNeighborhood } from '@src/store/userNeighborhoods/thunks';
import { CURRENT_CURRENCIES } from '@constants/core';
import { CurrencyEnum } from '@src/types/default.types';
import { getCurrentNeighborhood } from '@src/store/currentNeighborhood/thunks';
import Loader from '@src/components/Loader/Loader';
import styles from './EditNeighborhoodPage.module.scss';

const EditNeighborhoodPage: React.FC = () => {
  const { id } = useParams();
  const neighborhood = useAppSelector((state) => state.userNeighborhoods.entities[id]);
  const initialValues = {
    name: neighborhood?.name || '',
    currency: neighborhood?.currency || CurrencyEnum.UAH,
    description: neighborhood?.description,
    errors: {},
  };
  const [values, setValues] = useState<IEditNeighborhood>(initialValues);
  const currentNeighborhood = useAppSelector((state) => state.currentNeighborhood.neighborhood);
  const currentNeighborhoodLoading = useAppSelector((state) => state.currentNeighborhood.isLoading);
  const [isLoading, setLoading] = useState(false);
  const hasNoChange = useMemo(() => JSON.stringify(initialValues) === JSON.stringify(values), [values]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  useEffect(() => {
    if (currentNeighborhood?._id !== id) {
      dispatch(getCurrentNeighborhood(id))
        .unwrap()
        .then((value) => {
          if (value.neighborhood.role !== NeighborhoodRoleEnum.admin) {
            navigate('/neighborhoods');
          }
        })
        .catch(() => {
          navigate('/neighborhoods');
        });
    }
  }, [id]);
  
  useEffect(() => {
    if (!id || !neighborhood) {
      navigate('/neighborhoods');
    }
  }, [id, neighborhood]);
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!Object.values(values.errors).length) {
      setLoading(true);
      dispatch(editNeighborhood({ neighborhoodId: id, values }))
        .then(() => {
          navigate(`/neighborhoods/${id}`);
        })
        .finally(() => {
          setLoading(true);
        });
    }
  };
  
  return (
    <div className={styles.EditNeighborhoodPageWrapper}>
      {currentNeighborhoodLoading ? <Loader/> : (
        <div className={styles.EditNeighborhoodFormWrapper}>
          <div className={styles.EditNeighborhoodTitleWrapper}>
            <div className={styles.EditNeighborhoodBack}>
              <BackButton/>
            </div>
            <h3 className={styles.EditNeighborhoodTitle}>{t('editNeighborhood')}</h3>
          </div>
          <form className={styles.EditNeighborhoodForm}>
            <div className={styles.EditSelectWrapper}>
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
                type='submit'
                onClick={handleSubmit}
                text={t('edit')}
                disabled={Boolean(Object.values(values.errors).length) || isLoading || hasNoChange}
              />
            </div>
          </form>
        </div>
      )}
    
    </div>
  );
};

export default EditNeighborhoodPage;
