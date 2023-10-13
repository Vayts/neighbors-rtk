import { ErrorType } from '@src/types/default.types';
import { DEBT_VALIDATION } from '@constants/validation';
import { ONLY_NUMBER_REGEX } from '@constants/regex';
import i18n from 'i18next';
import { IAddPayment } from '@src/types/payment.types';

const { t } = i18n;
function validateAddPaymentAmount(value: string, total: number, current: number): ErrorType {
  const errors: Record<string, string> = {};
  
  if (!value) {
    errors.amount = t('requiredField');
    return errors;
  }
  
  const number = parseFloat(value);
  
  if (number < DEBT_VALIDATION.minPayment) {
    errors.amount = t('atLeastNumber', { value: DEBT_VALIDATION.minPayment });
  }
  
  if (!ONLY_NUMBER_REGEX.test(value)) {
    errors.amount = t('onlyNumbers');
    return errors;
  }
  
  if (number + current > total) {
    errors.amount = t('smallerPaymentError');
    return errors;
  }
  
  return errors;
}

export function getAddPaymentValidation(values: IAddPayment, total: number, current: number): ErrorType {
  const amountValidation = validateAddPaymentAmount(values.amount, total, current);
  
  return {
    ...amountValidation,
  };
}
