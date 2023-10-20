import React, { ChangeEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import { useTranslation } from 'react-i18next';
import Input from '@src/components/UI/Input/Input';
import Button from '@src/components/UI/Button/Button';
import { IPlan } from '@src/types/plan.types';
import { IAddPayment } from '@src/types/payment.types';
import { getAddPaymentValidation } from '@src/validation/payments.validation';
import { addPlanPayment } from '@src/store/plans/thunks';
import { setLoadingPlans } from '@src/store/plans/slice';

type Props = {
  plan: IPlan,
}

const initialValues: IAddPayment = {
  amount: '',
  errors: {},
};

const PlanPaymentForm: React.FC<Props> = ({ plan }) => {
  const [values, setValues] = useState<IAddPayment>(initialValues);
  const isLoading = useAppSelector((state) => state.plans.loadingItems).includes(plan._id);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setValues((prev) => {
      const newState = {
        ...prev,
        [name]: value,
      };
      
      return {
        ...newState,
        errors: getAddPaymentValidation(newState, plan.paymentAmount as number, plan.currentPayment),
      };
    });
  };
  
  const handleAddPayment = (e: React.FormEvent) => {
    setValues(initialValues);
    e.preventDefault();
    dispatch(setLoadingPlans(plan._id));
    dispatch(addPlanPayment({ planId: plan._id, amount: values.amount }))
      .finally(() => {
        dispatch(setLoadingPlans(plan._id));
      });
  };
  
  return (
    <form onSubmit={handleAddPayment}>
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
          />
        </div>
        <Button
          text={t('addPayment')}
          onClick={handleAddPayment}
          disabled={Boolean(Object.keys(values.errors).length) || !values.amount || isLoading}
        />
      </>
    </form>
  );
};

export default PlanPaymentForm;
