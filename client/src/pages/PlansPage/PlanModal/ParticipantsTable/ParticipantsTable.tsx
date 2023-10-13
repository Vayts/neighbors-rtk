import React from 'react';
import { CurrencyEnum } from '@src/types/default.types';
import { IParticipantPayment } from '@src/types/plan.types';
import ParticipantRow from '@src/pages/PlansPage/PlanModal/ParticipantRow/ParticipantRow';
import styles from './ParticipantsTable.module.scss';

type Props = {
  total: number | null,
  participantPayments: IParticipantPayment[],
  currency: CurrencyEnum,
  isPaymentRequired: boolean,
}

const ParticipantsTable: React.FC<Props> = ({ participantPayments, currency, isPaymentRequired, total }) => {
  return (
    <table className={styles.ParticipantsTable}>
      <tbody>
        {participantPayments.map((item, index) => {
          return (
            <ParticipantRow
              key={`participant-row-${item.participant_id}`}
              participantPayment={item}
              index={index}
              isPaymentRequired={isPaymentRequired}
              total={total}
              currency={currency}
            />
          );
        })}
      </tbody>
    </table>
  );
};

export default ParticipantsTable;
