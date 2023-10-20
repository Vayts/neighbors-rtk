import { ICreateNeighborhood, IEditNeighborhood } from '@src/types/neighborhood.types';
import { CurrencyEnum, ErrorType } from '@src/types/default.types';
import { DEFAULT_REGEX_EXP } from '@constants/regex';
import i18n from 'i18next';
import { NEIGHBORHOOD_VALIDATION } from '@constants/validation';

const { t } = i18n;

function validateNeighborhoodName(str: string): ErrorType {
  const errors: ErrorType = {};
  const trimmed = str.trim();
  
  if (trimmed === '') {
    errors.name = t('requiredField');
    return errors;
  }
  
  if (!DEFAULT_REGEX_EXP.test(trimmed)) {
    errors.name = t('incorrectValue');
    return errors;
  }
  
  if (trimmed.length < NEIGHBORHOOD_VALIDATION.minName) {
    errors.name = t('atLeast', { value: NEIGHBORHOOD_VALIDATION.minName });
    return errors;
  }
  
  if (trimmed.length > NEIGHBORHOOD_VALIDATION.maxName) {
    errors.name = t('lessThan', { value: NEIGHBORHOOD_VALIDATION.maxName });
    return errors;
  }
  
  return errors;
}

function validateNeighborhoodDescription(str: string): ErrorType {
  const errors: ErrorType = {};
  const trimmed = str.trim();
  
  if (trimmed === '') {
    errors.description = t('requiredField');
    return errors;
  }
  
  if (!DEFAULT_REGEX_EXP.test(trimmed)) {
    errors.description = t('incorrectValue');
    return errors;
  }
  
  if (trimmed.length < NEIGHBORHOOD_VALIDATION.minDescription) {
    errors.description = t('atLeast', { value: NEIGHBORHOOD_VALIDATION.minDescription });
    return errors;
  }
  
  if (trimmed.length > NEIGHBORHOOD_VALIDATION.maxDescription) {
    errors.description = t('lessThan', { value: NEIGHBORHOOD_VALIDATION.maxDescription });
    return errors;
  }
  
  return errors;
}

function validateNeighborhoodCurrency(str: string): ErrorType {
  const errors: ErrorType = {};
  const trimmed = str.trim();
  
  if (trimmed === '') {
    errors.currency = t('requiredField');
    return errors;
  }
  
  if (!Object.values(CurrencyEnum).includes(str as CurrencyEnum)) {
    errors.currency = t('currencyNotSupported');
    return errors;
  }
  
  return errors;
}

export function getCreateNeighborhoodValidation(values: ICreateNeighborhood | IEditNeighborhood): ErrorType {
  const nameValidation = validateNeighborhoodName(values.name);
  const descriptionValidation = validateNeighborhoodDescription(values.description);
  const currencyValidation = validateNeighborhoodCurrency(values.currency);
  
  return {
    ...nameValidation,
    ...descriptionValidation,
    ...currencyValidation,
  };
}
