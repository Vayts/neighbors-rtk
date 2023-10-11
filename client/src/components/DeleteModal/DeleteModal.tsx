import React from 'react';
import { IDeleteModalProps } from '@src/components/DeleteModal/types';
import Button from '@src/components/UI/Button/Button';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@src/hooks/hooks';
import styles from './DeleteModal.module.scss';

const DeleteModal: React.FC<IDeleteModalProps> = ({ itemId, text, action, onClose }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  const onDeleteHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    dispatch(action(itemId));
    onClose();
  };
  
  return (
    <div className={styles.ModalWrapper}>
      <h3 className={styles.ModalTitle}>{t('confirmDelete')}</h3>
      <p className={styles.ModalText}>{text}</p>
      <div className={styles.ModalButtons}>
        <Button
          text={t('confirm')}
          onClick={onDeleteHandler}
          isDanger
        />
        <Button
          text={t('cancel')}
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default DeleteModal;
