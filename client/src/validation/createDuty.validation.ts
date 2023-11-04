import { ErrorType } from '@src/types/default.types';
import { DEFAULT_REGEX_EXP } from '@constants/regex';
import { DUTY_VALIDATIONS } from '@constants/validation';
import i18n from 'i18next';
import { ICreateDuty, IEditDuty } from '@src/types/duty.types';

const { t } = i18n;

function validateDutyName(str: string): ErrorType {
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
  
  if (trimmed.length < DUTY_VALIDATIONS.minName) {
    errors.name = t('atLeast', { value: DUTY_VALIDATIONS.minName });
    return errors;
  }
  
  if (trimmed.length > DUTY_VALIDATIONS.maxName) {
    errors.name = t('lessThan', { value: DUTY_VALIDATIONS.maxName });
    return errors;
  }
  
  return errors;
}

function validateNeighborhoodInDuty(str: string): ErrorType {
  const errors: ErrorType = {};
  const trimmed = str.trim();
  
  if (trimmed === '') {
    errors.neighborhood_id = t('requiredField');
    return errors;
  }
  
  return errors;
}

function validateParticipants(participants: string[]): ErrorType {
  const errors: ErrorType = {};
  
  if (participants.length < DUTY_VALIDATIONS.minParticipantsLength) {
    errors.participants = t('atLeastOneParticipant');
  }
  
  return errors;
}

export function getCreateDutyValidation(values: ICreateDuty): ErrorType {
  const nameValidation = validateDutyName(values.name);
  const neighborhood = validateNeighborhoodInDuty(values.neighborhood_id);
  
  const errors: ErrorType = {
    ...nameValidation,
    ...neighborhood,
  };
  
  if (!values.isAllMembersInvited) {
    Object.assign(errors, validateParticipants(values.participants));
  }
  
  return {
    ...errors,
  };
}

export function getEditDutyValidation(values: IEditDuty): ErrorType {
  const nameValidation = validateDutyName(values.name);
  
  const errors: ErrorType = {
    ...nameValidation,
  };
  
  return {
    ...errors,
  };
}
