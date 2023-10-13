import { ErrorType } from '@src/types/default.types';

export interface IAddPayment {
  amount: string,
  errors: ErrorType,
}
