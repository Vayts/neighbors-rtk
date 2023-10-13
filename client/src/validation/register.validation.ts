import { IRegister } from '@src/types/auth.types';
import { ErrorType } from '@src/types/default.types';
import { DEFAULT_REGEX, LOGIN_REGEX, NUMBER_REGEX, PASSWORD_REGEX, UPPER_CASE_REGEX } from '@constants/regex';
import i18n from 'i18next';
import { REGISTER_VALIDATION } from '@constants/validation';

const { t } = i18n;

function validateFirstName(str: string): ErrorType {
  const errors: Record<string, string> = {};
  const trimmed = str.trim();
  
  if (trimmed === '') {
    errors.firstName = t('requiredField');
    return errors;
  }
  
  if (!DEFAULT_REGEX.test(trimmed)) {
    errors.firstName = t('incorrectValue');
    return errors;
  }
  
  if (trimmed.length < REGISTER_VALIDATION.minFirstName) {
    errors.firstName = t('atLeast', { value: REGISTER_VALIDATION.minFirstName });
    return errors;
  }
  
  if (trimmed.length > REGISTER_VALIDATION.maxFirstName) {
    errors.firstName = t('lessThan', { value: REGISTER_VALIDATION.maxFirstName });
    return errors;
  }
  
  return errors;
}

function validateLastName(str: string): ErrorType {
  const errors: Record<string, string> = {};
  const trimmed = str.trim();
  
  if (trimmed === '') {
    errors.lastName = t('requiredField');
    return errors;
  }
  
  if (!DEFAULT_REGEX.test(trimmed)) {
    errors.lastName = t('incorrectValue');
    return errors;
  }
  
  if (trimmed.length < REGISTER_VALIDATION.minLastName) {
    errors.lastName = t('atLeast', { value: REGISTER_VALIDATION.minLastName });
    return errors;
  }
  
  if (trimmed.length > REGISTER_VALIDATION.maxLastName) {
    errors.lastName = t('lessThan', { value: REGISTER_VALIDATION.maxLastName });
    return errors;
  }
  
  return errors;
}

function validateLogin(str: string): ErrorType {
  const errors: Record<string, string> = {};
  const trimmed = str.trim();
  
  if (trimmed === '') {
    errors.login = t('requiredField');
    return errors;
  }
  
  if (!LOGIN_REGEX.test(trimmed)) {
    errors.login = t('incorrectValue');
    return errors;
  }
  
  if (str.length < REGISTER_VALIDATION.minLogin) {
    errors.login = t('atLeast', { value: REGISTER_VALIDATION.minLogin });
    return errors;
  }
  
  if (str.length > REGISTER_VALIDATION.maxLogin) {
    errors.login = t('lessThan', { value: REGISTER_VALIDATION.maxLogin });
    return errors;
  }
  
  return errors;
}

function validatePassword(str: string): ErrorType {
  const errors: Record<string, string> = {};
  const trimmed = str.trim();
  
  if (trimmed === '') {
    errors.password = t('requiredField');
    return errors;
  }
  
  if (!PASSWORD_REGEX.test(trimmed)) {
    errors.password = t('incorrectValue');
    return errors;
  }
  
  if (!UPPER_CASE_REGEX.test(trimmed)) {
    errors.password = t('atLeast1UpperCase');
    return errors;
  }
  
  if (!NUMBER_REGEX.test(trimmed)) {
    errors.password = t('atLeast1Number');
    return errors;
  }
  
  if (trimmed.length < REGISTER_VALIDATION.minPassword) {
    errors.password = t('atLeast', { value: REGISTER_VALIDATION.minPassword });
    return errors;
  }
  
  if (trimmed.length > REGISTER_VALIDATION.maxPassword) {
    errors.password = t('lessThan', { value: REGISTER_VALIDATION.maxPassword });
    return errors;
  }
  
  return errors;
}

export function getRegisterValidation(values: IRegister): ErrorType {
  const firstNameValidation = validateFirstName(values.firstName);
  const lastNameValidation = validateLastName(values.lastName);
  const loginValidation = validateLogin(values.login);
  const passwordValidation = validatePassword(values.password);
  
  return {
    ...firstNameValidation,
    ...lastNameValidation,
    ...loginValidation,
    ...passwordValidation,
  };
}
