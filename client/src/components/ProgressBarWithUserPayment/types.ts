import { CurrencyEnum } from '@src/types/default.types';
import { IPlanParticipant } from '@src/types/plan.types';

export interface IProgressBarWithUserPaymentProps {
  currency: CurrencyEnum,
  total: number,
  current: number,
  participants: IPlanParticipant[],
  withoutText?: boolean,
  big?: boolean,
}
