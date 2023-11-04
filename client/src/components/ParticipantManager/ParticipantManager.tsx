import React from 'react';
import { IParticipantManager } from '@src/components/ParticipantManager/types';
import { STATIC_HREF } from '@constants/core';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@src/hooks/hooks';
import { selectMembersByIds } from '@src/store/members/selectors';
import { IMember } from '@src/types/user.types';
import cn from 'classnames';
import { selectUser } from '@src/store/auth/selectors';
import styles from './ParticipantManager.module.scss';

const ParticipantManager: React.FC<IParticipantManager> = ({
  participants,
  neighborhoodId,
  onParticipantRemove,
  onParticipantAdd,
}) => {
  const user = useAppSelector(selectUser);
  const memberIds = useAppSelector((state) => state.userNeighborhoods.entities[neighborhoodId])?.members;
  const members: IMember[] = useAppSelector((state) => selectMembersByIds(state, memberIds));
  const { t } = useTranslation();
  
  return (
    <div className={styles.ModalWrapper}>
      <h3 className={styles.ModalTitle}>{t('members', { value: participants.length })}</h3>
      <ul className={styles.ModalMembersList}>
        {members.map((item) => {
          return (
            <li className={styles.ModalMemberItem} key={`member-menu-${item._id}`}>
              <img
                src={`${STATIC_HREF}/${item.avatar}`}
                alt={`${item.fullName} avatar`}
                loading='lazy'
                className={styles.ModalMemberAvatar}
              />
              <p className={styles.ModalMemberName}>
                {item.fullName}
              </p>
              {
                user._id !== item._id && (
                  <span
                    className={
                      cn(
                        participants.includes(item._id) ? 'icon-cross' : 'icon-plus',
                        styles.ModalMemberIcon,
                      )
                    }
                    onClick={() => (participants.includes(item._id) ? onParticipantRemove(item._id) : onParticipantAdd(item._id))}
                  />
                )
              }
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ParticipantManager;
