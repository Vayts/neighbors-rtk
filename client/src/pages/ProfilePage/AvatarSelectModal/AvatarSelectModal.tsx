import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AVATARS, STATIC_HREF } from '@constants/core';
import Button from '@src/components/UI/Button/Button';
import cn from 'classnames';
import { IAvatarSelectModalProps } from '@src/pages/ProfilePage/AvatarSelectModal/types';
import styles from './AvatarSelectModal.module.scss';

const AvatarSelectModal: React.FC<IAvatarSelectModalProps> = ({ onSubmit, onClose, currentAvatar }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const { t } = useTranslation();
  
  const handleSubmit = () => {
    const event = { target: { value: selectedAvatar, name: 'avatar' } };
    
    onSubmit(event as React.ChangeEvent<HTMLInputElement>);
    onClose();
  };
  
  const handleSelect = (e: React.MouseEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    
    setSelectedAvatar(target.dataset.value);
  };
  
  return (
    <div className={styles.AvatarModalWrapper}>
      <h3 className={styles.AvatarModalTitle}>{t('chooseAvatar')}</h3>
      <ul className={styles.AvatarList}>
        {AVATARS.map((item) => {
          return (
            <li className={styles.AvatarItem} key={item}>
              <img
                src={`${STATIC_HREF}/${item}`}
                alt={item}
                className={cn(
                  styles.AvatarImg,
                  selectedAvatar === item && styles.AvatarImgCurrent,
                )}
                data-value={item}
                onClick={handleSelect}
              />
            </li>
          );
        })}
      </ul>
      <div className={styles.AvatarButtonWrapper}>
        <Button
          onClick={handleSubmit}
          text={t('chooseAction')}
          disabled={false}
        />
      </div>
    </div>
  );
};

export default AvatarSelectModal;
