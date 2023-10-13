import { CurrencyEnum } from '@src/types/default.types';
import { IParticipantPayment } from '@src/types/plan.types';

export interface IProgressBarWithUserPaymentProps {
  currency: CurrencyEnum,
  total: number,
  current: number,
  participantPayments: IParticipantPayment[],
  withoutText?: boolean,
  big?: boolean,
}
