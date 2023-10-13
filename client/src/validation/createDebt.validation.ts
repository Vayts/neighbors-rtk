import { ONLY_NUMBER_REGEX } from '@constants/regex';
import { ErrorType } from '@src/types/default.types';
import i18n from 'i18next';
import { DEBT_VALIDATION } from '@constants/validation';
import { ICreateDebt, IDebt, IEditDebt } from '@src/types/debt.types';

const { t } = i18n;

function validateNeighborhoodInDebt(str: string): ErrorType {
  const errors: ErrorType = {};
  const trimmed = str.trim();
  
  if (!trimmed) {
    errors.neighborhood_id = t('requiredField');
    return errors;
  }
  
  return errors;
}

function validateDebtor(str: string): ErrorType {
  const errors: ErrorType = {};
  const trimmed = str.trim();
  
  if (!trimmed) {
    errors.debtor_id = t('requiredField');
    return errors;
  }
  
  return errors;
}

function validateDebtAmount(value: string): ErrorType {
  const errors: Record<string, string> = {};
  
  if (!value) {
    errors.debtAmount = t('requiredField');
    return errors;
  }
  
  const number = parseFloat(value);
  
  if (!ONLY_NUMBER_REGEX.test(value)) {
    errors.debtAmount = t('onlyNumbers');
    return errors;
  }
  
  if (number > DEBT_VALIDATION.maxAmount) {
    errors.debtAmount = t('lessThanNumber', { value: DEBT_VALIDATION.maxAmount });
    return errors;
  }
  
  if (number < DEBT_VALIDATION.minAmount) {
    errors.debtAmount = t('atLeastNumber', { value: DEBT_VALIDATION.minAmount });
    return errors;
  }
  
  return errors;
}

function validateDueDate(date: Date | null): ErrorType {
  const errors: Record<string, string> = {};
  
  if (date) {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() + 2);

    if (date > currentDate) {
      errors.dueDate = t('maxRepaymentPeriod');
      return errors;
    }
  }
  
  return errors;
}

function validateDebtText(str: string) {
  const errors: ErrorType = {};
  const trimmed = str.trim();
  
  if (!trimmed) {
    errors.text = t('requiredField');
    return errors;
  }
  
  if (trimmed.length < DEBT_VALIDATION.minText) {
    errors.description = t('atLeast', { value: DEBT_VALIDATION.minText });
    return errors;
  }
  
  if (trimmed.length > DEBT_VALIDATION.maxText) {
    errors.description = t('lessThan', { value: DEBT_VALIDATION.maxText });
    return errors;
  }
  
  return errors;
}

export function getCreateDebtValidation(values: ICreateDebt): ErrorType {
  const neighborhoodValidation = validateNeighborhoodInDebt(values.neighborhood_id);
  const debtorValidation = validateDebtor(values.debtor_id);
  const amountValidation = validateDebtAmount(values.debtAmount);
  const dateValidation = validateDueDate(values.dueDate);
  const textValidation = validateDebtText(values.text);
  
  return {
    ...neighborhoodValidation,
    ...debtorValidation,
    ...amountValidation,
    ...dateValidation,
    ...textValidation,
  };
}

function validateEditDebtAmount(value: string, alreadyRepaid: number): ErrorType {
  const errors: Record<string, string> = {};
  
  if (!value) {
    errors.debtAmount = t('requiredField');
    return errors;
  }
  
  const number = parseFloat(value);
  
  if (!ONLY_NUMBER_REGEX.test(value)) {
    errors.debtAmount = t('onlyNumbers');
    return errors;
  }
  
  if (number < alreadyRepaid) {
    errors.debtAmount = t('newDebtAmountError');
    return errors;
  }
  
  if (number > DEBT_VALIDATION.maxAmount) {
    errors.debtAmount = t('lessThanNumber', { value: DEBT_VALIDATION.maxAmount });
    return errors;
  }
  
  if (number < DEBT_VALIDATION.minAmount) {
    errors.debtAmount = t('atLeastNumber', { value: DEBT_VALIDATION.minAmount });
    return errors;
  }
  
  return errors;
}

export function getEditDebtValidation(values: IEditDebt, debtForEdit: IDebt): ErrorType {
  const amountValidation = validateEditDebtAmount(values.debtAmount, debtForEdit.repaidAmount);
  const dateValidation = validateDueDate(values.dueDate);
  const textValidation = validateDebtText(values.text);
  
  return {
    ...amountValidation,
    ...dateValidation,
    ...textValidation,
  };
}
