import React, { useCallback, useState } from 'react';
import Button from '@src/components/UI/Button/Button';
import { useTranslation } from 'react-i18next';
import { ICurrentNeighborhood } from '@src/types/neighborhood.types';
import Input from '@src/components/UI/Input/Input';
import { useAppDispatch } from '@src/hooks/hooks';
import { deleteNeighborhood } from '@src/store/currentNeighborhood/thunks';
import { errorManager } from '@helpers/errors.helper';
import { ErrorEnum } from '@src/types/default.types';
import { useNavigate } from 'react-router-dom';
import styles from './DeleteNeighborhoodModal.module.scss';

type Props = {
  neighborhood: ICurrentNeighborhood,
  onClose: () => void;
}

const DeleteNeighborhoodModal: React.FC<Props> = ({ neighborhood, onClose }) => {
  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  const handleDelete = () => {
    setLoading(true);
    dispatch(deleteNeighborhood(neighborhood._id))
      .unwrap()
      .then(() => {
        navigate('/neighborhoods');
      })
      .catch((value) => errorManager(value, ErrorEnum.neighborhood))
      .finally(() => {
        onClose();
        setLoading(false);
      });
  };
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);
  
  return (
    <div className={styles.ModalWrapper}>
      <h3 className={styles.ModalTitle}>{t('confirmDelete')}</h3>
      <p className={styles.ModalText}>{t('neighborhoodDeleteText', { value: neighborhood?.name })}</p>
      <div className="mb-16">
        <Input
          onChange={handleChange}
          value={value}
          name='name'
          placeholder={t('enterName')}
        />
      </div>
      <div className={styles.ModalButtons}>
        <Button
          text={t('confirm')}
          onClick={handleDelete}
          disabled={value !== neighborhood.name || isLoading}
          isDanger
        />
        <Button
          disabled={isLoading}
          text={t('cancel')}
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default DeleteNeighborhoodModal;
