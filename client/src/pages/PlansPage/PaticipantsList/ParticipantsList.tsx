import React, { Fragment, useId } from 'react';
import { Tooltip } from 'react-tooltip';
import { STATIC_HREF } from '@constants/core';
import { IMember } from '@src/types/user.types';
import styles from './ParticipantsList.module.scss';

type Props = {
  participants: IMember[],
}

const ParticipantsList: React.FC<Props> = ({ participants }) => {
  const id = useId();
  const shouldSliced = participants.length > 3;
  
  return (
    <div className={styles.ParticipantsWrapper}>
      {participants.slice(0, shouldSliced ? 2 : 3).map((item) => {
        return (
          <Fragment key={`${item._id}-user-list-${id}`}>
            <img
              data-tooltip-id={`${item._id}-participant`}
              className={styles.ParticipantAvatar}
              src={`${STATIC_HREF}/${item.avatar}`}
              alt={`${item.fullName} avatar`}
            />
            <Tooltip
              style={{ zIndex: 7 }}
              id={`${item._id}-participant`}
              place="bottom"
              content={item.fullName}
            />
          </Fragment>
        );
      })}
      {shouldSliced && <div className={styles.ParticipantFiller}>{`+${participants.length - 2}`}</div>}
    </div>
  );
};

export default ParticipantsList;
