import React, { Fragment, ReactNode, useId, useState } from 'react';
import { STATIC_HREF } from '@constants/core';
import { Tooltip } from 'react-tooltip';
import { IMember } from '@src/types/user.types';
import { useTranslation } from 'react-i18next';
import Modal from '@src/components/Modal/Modal';
import styles from './MembersList.module.scss';

type Props = {
  members: IMember[]
  modal: ReactNode,
}

const MembersList: React.FC<Props> = ({ members, modal }) => {
  const [isInModal, setIsInModal] = useState(false);
  const id = useId();
  const shouldSliced = members.length > 3;
  const { t } = useTranslation();
  const handleCloseModal = () => {
    setIsInModal(false);
  };
  
  const handleOpenModal = () => {
    setIsInModal(true);
  };
  
  return (
    <>
      {isInModal && (
        <Modal
          closeFunc={handleCloseModal}
          withCloseIcon
        >
          {modal}
        </Modal>
      )}
      <div className={styles.MembersWrapper} onClick={handleOpenModal}>
        {members.slice(0, shouldSliced ? 2 : 3).map((item) => {
          return (
            <Fragment key={`${item._id}-user-list-${id}`}>
              <img
                data-tooltip-id={`${item._id}-participant`}
                className={styles.MemberAvatar}
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
        {shouldSliced && (
          <div
            data-tooltip-id={`${id}-membersMore`}
            className={styles.MemberFiller}
          >
            {`+${members.length - 2}`}
          </div>
        )}
        <Tooltip
          style={{ zIndex: 7 }}
          id={`${id}-membersMore`}
          place="bottom"
          content={t('moreCounter', { value: members.length - 2 })}
        />
      </div>
    </>
  );
};

export default MembersList;
