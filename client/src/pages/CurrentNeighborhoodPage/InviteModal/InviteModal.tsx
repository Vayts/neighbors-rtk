import React, { useState } from 'react';
import { STATIC_HREF } from '@constants/core';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import { NeighborhoodRoleEnum } from '@src/types/neighborhood.types';
import cn from 'classnames';
import copy from 'copy-to-clipboard';
import { getNotification } from '@helpers/notification.helper';
import Button from '@src/components/UI/Button/Button';
import { generateInviteCode, removeInviteCode } from '@src/store/currentNeighborhood/thunks';
import Loader from '@src/components/Loader/Loader';
import styles from './InviteModal.module.scss';

const InviteModal: React.FC = () => {
  const [isLoading, setLoading] = useState(false);
  const neighborhood = useAppSelector((state) => state.currentNeighborhood.neighborhood);
  const isAdmin = neighborhood?.role === NeighborhoodRoleEnum.admin;
  const showGenerate = isAdmin && !neighborhood?.inviteCode && !isLoading;
  const showRemove = isAdmin && neighborhood?.inviteCode && !isLoading;
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  const copyToClipboard = () => {
    const isCopy = copy(neighborhood?.inviteCode || '');
    
    if (isCopy) {
      getNotification(t('copiedToClipboard'));
    }
  };
  
  const handleGenerateInviteCode = () => {
    setLoading(true);
    dispatch(generateInviteCode()).finally(() => {
      setLoading(false);
    });
  };
  
  const handleRemoveInviteCode = () => {
    setLoading(true);
    dispatch(removeInviteCode()).finally(() => {
      setLoading(false);
    });
  };
  
  return (
    <div className={styles.InviteModalWrapper}>
      <h3 className={styles.InviteModalTitle}>{t('inviteToNeighborhoodTitle')}</h3>
      <img className={styles.InviteModalImg} src={`${STATIC_HREF}/banner6.png`} alt='invite banner img'/>
      {!neighborhood?.inviteCode && <p className={styles.InviteModalText}>{t(isAdmin ? 'generateInviteCodeTextAdmin' : 'generateInviteCodeTestUser')}</p>}
      
      {neighborhood?.inviteCode && <p className={styles.InviteModalText}>{t('sendInviteCodeText')}</p>}
      
      {neighborhood?.inviteCode && (
        <div className={styles.InviteCodeWrapper}>
          <span className={cn(styles.InviteCodeCopyButton, 'icon-copy')} onClick={copyToClipboard}/>
          <span>{neighborhood?.inviteCode}</span>
        </div>
      )}
      
      <div className={styles.InviteModalButtons}>
        {showGenerate && (
          <Button
            disabled={isLoading}
            onClick={handleGenerateInviteCode}
            text={t('createInviteCode')}
          />
        )}
        {showRemove && (
          <Button
            disabled={isLoading}
            onClick={handleRemoveInviteCode}
            text={t('removeInviteCode')}
            isDanger
          />
        )}
        
        {isLoading && <Loader/>}
      </div>
      
    </div>
  );
};

export default InviteModal;
