import { IEditProfile } from '@src/types/auth.types';
import { validateFirstName, validateLastName } from '@src/validation/auth.validation';
import i18n from 'i18next';
import { AVATARS } from '@constants/core';
import { ErrorType } from '@src/types/default.types';

const { t } = i18n;

function validateAvatar(str: string) {
  const errors: Record<string, string> = {};
  const trimmed = str.trim();
  
  if (trimmed === '') {
    errors.avatar = t('requiredField');
    return errors;
  }
  
  if (!AVATARS.includes(trimmed)) {
    errors.avatar = t('incorrectValue');
    return errors;
  }
}

export function getEditProfileValidation(values: IEditProfile): ErrorType {
  const firstNameValidation = validateFirstName(values.firstName);
  const lastNameValidation = validateLastName(values.lastName);
  const avatarValidation = validateAvatar(values.avatar);
  
  return {
    ...firstNameValidation,
    ...lastNameValidation,
    ...avatarValidation,
  };
}
