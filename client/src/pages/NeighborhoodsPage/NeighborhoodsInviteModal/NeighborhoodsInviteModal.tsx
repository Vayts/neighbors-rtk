import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@src/components/UI/Button/Button';
import Input from '@src/components/UI/Input/Input';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import NeighborhoodSmallCard from '@src/components/NeighborhoodSmallCard/NeighborhoodSmallCard';
import { STATIC_HREF } from '@constants/core';
import { resetNeighborhoodByCode } from '@src/store/userNeighborhoods/slice';
import { getNeighborhoodByCode, joinNeighborhoodByCode } from '@src/store/userNeighborhoods/thunks';
import styles from './NeighborhoodsInviteModal.module.scss';

type Props = {
  setInviteOpen: (value: boolean) => void;
}

const NeighborhoodsInviteModal: React.FC<Props> = ({ setInviteOpen }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setLoading] = useState(false);
  const neighborhood = useAppSelector((state) => state.userNeighborhoods.neighborhoodByCode);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    return () => {
      dispatch(resetNeighborhoodByCode());
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInviteCode(e.target.value);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(getNeighborhoodByCode(inviteCode));
  };

  const handleEnterAnotherCode = () => {
    setInviteCode('');
    dispatch(resetNeighborhoodByCode());
  };

  const handleJoin = () => {
    setLoading(true);
    dispatch(joinNeighborhoodByCode({ id: neighborhood?._id as string, code: inviteCode }))
      .unwrap()
      .then(() => {
        setInviteOpen(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={styles.InviteModalWrapper}>
      <h3 className={styles.InviteModalTitle}>{t('joinNeighborhood')}</h3>
      <img className={styles.InviteModalImg} src={`${STATIC_HREF}/banner6.png`} alt='invite banner img'/>
      <p className={styles.InviteModalText}>{t('inviteModalText')}</p>
      {!neighborhood && (
        <form>
          <div className={styles.InviteInputWrapper}>
            <Input
              onChange={handleChange}
              value={inviteCode}
              name='login'
              placeholder={t('enterCodeInvite')}
            />
          </div>
          <Button
            disabled={Boolean(!inviteCode.length) || isLoading}
            onClick={handleSubmit}
            text={t('search')}
          />
        </form>
      )}

      {neighborhood && (
        <>
          <NeighborhoodSmallCard neighborhood={neighborhood}/>
          <div className={styles.InviteModalButtons}>
            <Button
              disabled={isLoading}
              onClick={handleJoin}
              text={t('join')}
            />
            <Button
              disabled={isLoading}
              onClick={handleEnterAnotherCode}
              text={t('enterAnotherCode')}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default NeighborhoodsInviteModal;
