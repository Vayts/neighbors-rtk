import { ErrorType } from '@src/types/default.types';
import { ICreatePlan, ICreatePlanTask, IEditPlan, IPlan } from '@src/types/plan.types';
import i18n from 'i18next';
import { PLAN_VALIDATION } from '@constants/validation';
import { DEFAULT_REGEX_EXP, ONLY_NUMBER_REGEX } from '@constants/regex';

const { t } = i18n;

function validateParticipants(participants: string[]): ErrorType {
  const errors: ErrorType = {};
  
  if (participants.length < PLAN_VALIDATION.minParticipantsLength) {
    errors.participants = t('atLeastOneParticipant');
  }
  
  return errors;
}

function validatePlanTasks(tasks: ICreatePlanTask[]): ErrorType {
  const errors: ErrorType = {};
  
  if (tasks.length < PLAN_VALIDATION.minTasksLength) {
    errors.tasksList = t('atLeastOneTask');
  }
  
  return errors;
}

function validatePlanPaymentAmount(value: string): ErrorType {
  const errors: Record<string, string> = {};
  
  if (!value) {
    errors.paymentAmount = t('requiredField');
    return errors;
  }
  
  const number = parseFloat(value);
  
  if (!ONLY_NUMBER_REGEX.test(value)) {
    errors.paymentAmount = t('onlyNumbers');
    return errors;
  }
  
  if (number > PLAN_VALIDATION.maxAmount) {
    errors.paymentAmount = t('lessThanNumber', { value: PLAN_VALIDATION.maxAmount });
    return errors;
  }
  
  if (number < PLAN_VALIDATION.minAmount) {
    errors.paymentAmount = t('atLeastNumber', { value: PLAN_VALIDATION.minAmount });
    return errors;
  }
  
  return errors;
}

function validatePlanName(str: string): ErrorType {
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
  
  if (trimmed.length < PLAN_VALIDATION.minName) {
    errors.name = t('atLeast', { value: PLAN_VALIDATION.minName });
    return errors;
  }
  
  if (trimmed.length > PLAN_VALIDATION.maxName) {
    errors.name = t('lessThan', { value: PLAN_VALIDATION.maxName });
    return errors;
  }
  
  return errors;
}

function validatePlanDescription(str: string): ErrorType {
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
  
  if (trimmed.length < PLAN_VALIDATION.minDescription) {
    errors.description = t('atLeast', { value: PLAN_VALIDATION.minDescription });
    return errors;
  }
  
  if (trimmed.length > PLAN_VALIDATION.maxDescription) {
    errors.description = t('lessThan', { value: PLAN_VALIDATION.maxDescription });
    return errors;
  }
  
  return errors;
}

function validatePlanEventDate(date: Date | null): ErrorType {
  const errors: Record<string, string> = {};
  
  if (date) {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() + 1);
    
    if (date > currentDate) {
      errors.eventDate = t('maxPlanPeriod');
      return errors;
    }
  }
  
  return errors;
}

export function getPlanTaskValidation(str: string): string {
  let error = '';
  const trimmed = str.trim();
  
  if (trimmed.length < PLAN_VALIDATION.minTask) {
    error = t('atLeast', { value: PLAN_VALIDATION.minTask });
    return error;
  }
  
  if (trimmed.length > PLAN_VALIDATION.maxTask) {
    error = t('lessThan', { value: PLAN_VALIDATION.maxTask });
    return error;
  }
  
  return error;
}

function validateNeighborhoodInPlan(str: string): ErrorType {
  const errors: ErrorType = {};
  const trimmed = str.trim();
  
  if (trimmed === '') {
    errors.neighborhood_id = t('requiredField');
    return errors;
  }
  
  return errors;
}

export function getCreatePlanValidation(values: ICreatePlan): ErrorType {
  const nameValidation = validatePlanName(values.name);
  const descriptionValidation = validatePlanDescription(values.description);
  const dateValidation = validatePlanEventDate(values.eventDate);
  const neighborhood = validateNeighborhoodInPlan(values.neighborhood_id);
  
  const errors: ErrorType = {
    ...nameValidation,
    ...descriptionValidation,
    ...dateValidation,
    ...neighborhood,
  };
  
  if (!values.isAllMembersInvited) {
    Object.assign(errors, validateParticipants(values.participants));
  }
  
  if (values.isPaymentRequired) {
    Object.assign(errors, validatePlanPaymentAmount(values.paymentAmount));
  }
  
  if (values.isTasksListRequired) {
    Object.assign(errors, validatePlanTasks(values.tasksList));
  }
  
  return {
    ...errors,
  };
}

function validateNewPlanPaymentAmount(value: string, currentPayment: number): ErrorType {
  const errors: Record<string, string> = {};
  
  if (!value) {
    errors.paymentAmount = t('requiredField');
    return errors;
  }
  
  const number = parseFloat(value);
  
  if (!ONLY_NUMBER_REGEX.test(value)) {
    errors.paymentAmount = t('onlyNumbers');
    return errors;
  }
  
  if (number < currentPayment) {
    errors.paymentAmount = t('newPlanAmountSmallerError');
  }
  
  if (number > PLAN_VALIDATION.maxAmount) {
    errors.paymentAmount = t('lessThanNumber', { value: PLAN_VALIDATION.maxAmount });
    return errors;
  }
  
  if (number < PLAN_VALIDATION.minAmount) {
    errors.paymentAmount = t('atLeastNumber', { value: PLAN_VALIDATION.minAmount });
    return errors;
  }
  
  return errors;
}

export function getEditPlanValidation(values: IEditPlan, plan: IPlan): ErrorType {
  const nameValidation = validatePlanName(values.name);
  const descriptionValidation = validatePlanDescription(values.description);
  const dateValidation = validatePlanEventDate(values.eventDate);
  
  const errors: ErrorType = {
    ...nameValidation,
    ...descriptionValidation,
    ...dateValidation,
  };
  
  if (plan.isPaymentRequired) {
    Object.assign(errors, validateNewPlanPaymentAmount(values.paymentAmount, plan.currentPayment));
  }

  return {
    ...errors,
  };
}
