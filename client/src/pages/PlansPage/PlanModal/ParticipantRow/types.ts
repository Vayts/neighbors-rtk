import { IParticipantPayment } from '@src/types/plan.types';
import { CurrencyEnum } from '@src/types/default.types';

export interface IParticipantRowProps {
  participantPayment: IParticipantPayment,
  isPaymentRequired: boolean,
  total: number,
  currency: CurrencyEnum,
  index: number,
}
