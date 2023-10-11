import { ErrorEnum } from '@src/types/default.types';
import { AUTH_ERRORS, DEFAULT_ERRORS, NEIGHBORHOOD_ERRORS, PLAN_ERRORS } from '@constants/errors';
import { getNotification } from '@helpers/notification.helper';
import i18n from 'i18next';
import { NotificationTypeEnum } from '@src/types/notification.types';

const { t } = i18n;

function neighborhoodErrorManager(error: string) {
  switch (error) {
  case NEIGHBORHOOD_ERRORS.NEIGHBORHOOD_NOT_FOUND:
    getNotification(t('neighborhoodError.neighborhoodNotFound'), NotificationTypeEnum.error);
    break;
  case NEIGHBORHOOD_ERRORS.INVITE_CODE_EXPIRED:
    getNotification(t('neighborhoodError.inviteCodeExpired'), NotificationTypeEnum.error);
    break;
  case NEIGHBORHOOD_ERRORS.ALREADY_IN_NEIGHBORHOOD:
    getNotification(t('neighborhoodError.alreadyInNeighborhood'), NotificationTypeEnum.error);
    break;
  case NEIGHBORHOOD_ERRORS.NO_ACCESS:
    getNotification(t('neighborhoodError.noAccess'), NotificationTypeEnum.error);
    break;
  default:
    getNotification(t('somethingWentWrong'), 'error');
  }
}

function planErrorManager(error: string) {
  switch (error) {
  case PLAN_ERRORS.NOT_ENOUGH_PARTICIPANTS:
    getNotification(t('planError.notEnoughParticipants'), NotificationTypeEnum.error);
    break;
  default:
    getNotification(t('somethingWentWrong'), 'error');
  }
}

function authErrorManager(error: string) {
  switch (error) {
  case AUTH_ERRORS.USER_ALREADY_EXIST:
    getNotification(t('authError.userAlreadyExist'), NotificationTypeEnum.error);
    break;
  default:
    getNotification(t('somethingWentWrong'), 'error');
  }
}

function appErrorManager(error: string) {
  switch (error) {
  case DEFAULT_ERRORS.SOMETHING_WENT_WRONG:
    getNotification(t('somethingWentWrong'), 'error');
    break;
  default:
    getNotification(t('somethingWentWrong'), 'error');
  }
}

export function errorManager(error: string, type: ErrorEnum = ErrorEnum.app): void {
  switch (type) {
  case ErrorEnum.neighborhood:
    neighborhoodErrorManager(error);
    break;
  case ErrorEnum.plan:
    planErrorManager(error);
    break;
  case ErrorEnum.auth:
    authErrorManager(error);
    break;
  default:
    appErrorManager(error);
  }
}
