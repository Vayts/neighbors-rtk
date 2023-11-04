import React, { useId, useState } from 'react';
import { IDutyMark } from '@src/types/duty.types';
import { useAppSelector } from '@src/hooks/hooks';
import { STATIC_HREF } from '@constants/core';
import { Tooltip } from 'react-tooltip';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { selectUser } from '@src/store/auth/selectors';
import cn from 'classnames';
import Modal from '@src/components/Modal/Modal';
import DeleteModal from '@src/components/DeleteModal/DeleteModal';
import { deleteDutyMark } from '@src/store/duties/thunks';
import styles from './DutyMark.module.scss';

type Props = {
  dutyMark: IDutyMark,
}

const DutyMark: React.FC<Props> = ({ dutyMark }) => {
  const id = useId();
  const user = useAppSelector(selectUser);
  const [isInDelete, setInDelete] = useState(false);
  const author = useAppSelector((state) => state.members.entities[dutyMark.author_id]);
  const isAuthor = user?._id === dutyMark.author_id;
  const { t } = useTranslation();
  
  const toggleDeleteMarkModal = () => {
    setInDelete(!isInDelete);
  };
  
  return (
    <>
      
      {
        isInDelete && (
          <Modal
            withCloseIcon
            outsideHandler={toggleDeleteMarkModal}
            closeFunc={toggleDeleteMarkModal}
          >
            <DeleteModal
              itemId={dutyMark._id}
              action={deleteDutyMark}
              text={t('deleteMarkText')}
              onClose={toggleDeleteMarkModal}
            />
          </Modal>
        )
      }
      
      <div
        className={styles.DutyMark}
        data-tooltip-id={id}
      >
        <img
          src={`${STATIC_HREF}/${author.avatar}`}
          alt={`${author.fullName} avatar`}
          onClick={isAuthor ? toggleDeleteMarkModal : null}
          data-tooltip-id="anys"
          className={cn(styles.DutyMarkImage, isAuthor && styles.DutyMarkImageAuthor)}
        />
      
      </div>
      <Tooltip
        style={{
          zIndex: 1001,
          maxWidth: '150px',
        }}
        id={id}
        place="top"
        content={t('dutyMarkCreated', { author: author.fullName, date: format(new Date(dutyMark.createdAt), 'HH:mm dd/MM/yyyy') })}
      />
    </>
  );
};

export default DutyMark;
