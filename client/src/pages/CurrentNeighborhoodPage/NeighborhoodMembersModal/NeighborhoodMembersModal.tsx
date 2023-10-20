import React from 'react';
import { IMember } from '@src/types/user.types';
import { useTranslation } from 'react-i18next';
import { STATIC_HREF } from '@constants/core';
import { Menu } from '@src/components/UI/Menu/Menu';
import { useAppSelector } from '@src/hooks/hooks';
import { NeighborhoodRoleEnum } from '@src/types/neighborhood.types';
import { selectUser } from '@src/store/auth/selectors';
import NeighborhoodMemberMenu from '@src/pages/CurrentNeighborhoodPage/NeighborhoodMemberMenu/NeighborhoodMemberMenu';
import styles from './NeighborhoodMembersModal.module.scss';

type Props = {
  members: IMember[],
}

const NeighborhoodMembersModal: React.FC<Props> = ({ members }) => {
  const neighborhood = useAppSelector((state) => state.currentNeighborhood.neighborhood);
  const user = useAppSelector(selectUser);
  const { t } = useTranslation();
  
  return (
    <div className={styles.ModalWrapper}>
      <h3 className={styles.ModalTitle}>{t('members', { value: members.length })}</h3>
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
              {neighborhood.role === NeighborhoodRoleEnum.admin && user?._id !== item._id && (
                <div className={styles.ModalMemberMenu}>
                  <Menu>
                    <NeighborhoodMemberMenu member={item} />
                  </Menu>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NeighborhoodMembersModal;
