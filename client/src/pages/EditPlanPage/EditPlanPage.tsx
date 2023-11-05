import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import { useTranslation } from 'react-i18next';
import { CustomDateEventChange } from '@src/types/default.types';
import BackButton from '@src/components/BackButton/BackButton';
import DateInput from '@src/components/UI/DateInput/DateInput';
import Input from '@src/components/UI/Input/Input';
import TextArea from '@src/components/UI/TextArea/TextArea';
import Button from '@src/components/UI/Button/Button';
import { IEditPlan, IPlan } from '@src/types/plan.types';
import { getEditPlanValidation } from '@src/validation/createPlan.validation';
import { editPlan } from '@src/store/plans/thunks';
import { getEditPlanDto } from '@helpers/plans.helper';
import { useScrollTopOnMount } from '@src/hooks/useScrollTopOnMount';
import styles from './EditPlanPage.module.scss';

const EditPlanPage: React.FC = () => {
  useScrollTopOnMount();
  const { planId } = useParams();
  const planForEdit = useAppSelector((state) => state.plans.entities[planId]);
  const [searchParams] = useSearchParams();
  const id = searchParams.get('neighborhood_id');
  const [values, setValues] = useState<IEditPlan>({
    paymentAmount: planForEdit?.paymentAmount ? planForEdit.paymentAmount.toString() : '',
    description: planForEdit?.description || '',
    name: planForEdit?.name || '',
    errors: {},
    eventDate: planForEdit?.eventDate ? new Date(planForEdit.eventDate) : null,
  });
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  useEffect(() => {
    if (!planId || !planForEdit) {
      navigate(`/plans${id ? `?neighborhood_id=${id}` : ''}`);
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
        errors: getEditPlanValidation(newState, planForEdit as IPlan),
      };
    });
  }, []);
  
  const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!Object.values(values.errors).length) {
      setLoading(true);
      const dto = getEditPlanDto(values);
      dispatch(editPlan({ id: planId, values: dto }))
        .then(() => {
          navigate(`/plans${id ? `?neighborhood_id=${id}` : ''}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  
  return (
    <div className={styles.EditPlanPageWrapper}>
      <div className={styles.EditPlanFormWrapper}>
        <div className={styles.EditPlanTitleWrapper}>
          <div className={styles.EditPlanBack}>
            <BackButton/>
          </div>
          <h3 className={styles.EditPlanTitle}>{t('editPlan')}</h3>
        </div>
        <form className={styles.EditPlanForm}>
          <div className='mb-16'>
            <DateInput
              label={`${t('dateOfEvent')} (${t('optionalSmall')})`}
              value={values.eventDate}
              onChange={handleChange}
              name='eventDate'
              isInvalid={Boolean(values.errors?.eventDate)}
              error={values.errors?.eventDate}
              placeholder={t('selectDate')}
            />
          </div>
          {planForEdit?.isPaymentRequired && (
            <div className='mb-16'>
              <Input
                onChange={handleChange}
                value={values.paymentAmount}
                name='paymentAmount'
                label={t('paymentAmount')}
                placeholder={t('enterAmount')}
                error={values.errors?.paymentAmount}
                isInvalid={Boolean(values.errors?.paymentAmount)}
              />
            </div>
          )}
          <div className='mb-16'>
            <Input
              onChange={handleChange}
              value={values.name}
              name='name'
              label={t('planName')}
              placeholder={t('enterName')}
              error={values.errors?.name}
              isInvalid={Boolean(values.errors?.name)}
            />
          </div>
          <div className="mb-32">
            <TextArea
              onChange={handleChange}
              value={values.description}
              name='text'
              label={t('text')}
              placeholder={t('enterText')}
              error={values.errors?.description}
              isInvalid={Boolean(values.errors?.description)}
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

export default EditPlanPage;
