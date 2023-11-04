import React from 'react';
import { STATIC_HREF } from '@constants/core';
import { CurrencySymbolEnum } from '@src/types/default.types';
import { useAppSelector } from '@src/hooks/hooks';

import { IParticipantRowProps } from '@src/pages/PlansPage/PlanModal/ParticipantRow/types';
import styles from './ParticipantRow.module.scss';

const ParticipantRow: React.FC<IParticipantRowProps> = ({
  participantPayment,
  index,
  isPaymentRequired,
  total,
  currency,
}) => {
  const { participant_id, payment } = participantPayment;
  const participant = useAppSelector((state) => state.members.entities[participant_id]);
  
  return (
    <tr className={styles.ParticipantRow} key={`participant-row-${participant._id}`}>
      
      <td>{index + 1}</td>
      
      <td>
        <img
          src={`${STATIC_HREF}/${participant.avatar}`}
          className={styles.ParticipantAvatar}
          alt={`${participant.fullName} avatar`}
        />
      </td>
      
      <td>
        <p>
          {participant.fullName}
        </p>
      </td>
      
      {isPaymentRequired && total && <td>{`${payment} ${CurrencySymbolEnum[currency]} (${Math.round((payment as number / total) * 100)}%)`}</td> }
    </tr>
  );
};

export default ParticipantRow;
