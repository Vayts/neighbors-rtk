import React, { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import { IEditProfile } from '@src/types/auth.types';
import { STATIC_HREF } from '@constants/core';
import Button from '@src/components/UI/Button/Button';
import { useTranslation } from 'react-i18next';
import Input from '@src/components/UI/Input/Input';
import { getEditProfileValidation } from '@src/validation/profile.validation';
import { IUser } from '@src/types/user.types';
import Modal from '@src/components/Modal/Modal';
import AvatarSelectModal from '@src/pages/ProfilePage/AvatarSelectModal/AvatarSelectModal';
import { editProfile } from '@src/store/auth/thunks';
import styles from './ProfilePage.module.scss';

const ProfilePage: React.FC = () => {
  const user: IUser | null = useAppSelector((state) => state.auth.user);
  const [values, setValues] = useState<IEditProfile>({
    lastName: user?.lastName || '',
    firstName: user?.firstName || '',
    avatar: user?.avatar || '',
    errors: {},
  });
  const [isLoading, setLoading] = useState(false);
  const [isInAvatarModal, setInAvatarModal] = useState(false);
  const hasNoChange = user?.lastName === values.lastName
    && user?.firstName === values.firstName
    && user?.avatar === values.avatar;
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setValues((prev) => {
      const newState = {
        ...prev,
        [name]: value,
      };
      
      return {
        ...newState,
        errors: getEditProfileValidation(newState),
      };
    });
  }, []);
  
  const handleOpenChangeAvatarModal = () => {
    setInAvatarModal(true);
  };
  
  const handleCloseChangeAvatarModal = () => {
    setInAvatarModal(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    dispatch(editProfile(values))
      .finally(() => {
        setLoading(false);
      });
  };
  
  return (
    <div className={styles.ProfilePageWrapper}>
      
      {isInAvatarModal && (
        <Modal
          outsideHandler={handleCloseChangeAvatarModal}
          withCloseIcon
        >
          <AvatarSelectModal
            currentAvatar={values.avatar}
            onClose={handleCloseChangeAvatarModal}
            onSubmit={handleChange}
          />
        </Modal>
      )}
      
      <div className={styles.ProfileContentBlock}>
        
        <div className={styles.ProfileUserInfo}>
          <div className={styles.ProfileAvatarWrapper}>
            <img
              src={`${STATIC_HREF}/${values.avatar}`}
              alt={`${user?.fullName} avatar`}
              className={styles.ProfileAvatarImg}
            />
            <div className={styles.ProfileChangePhotoButton} onClick={handleOpenChangeAvatarModal}>
              <span className='icon-camera'/>
            </div>
          </div>
          <div>
            <h3 className={styles.ProfileUserName}>{user?.fullName}</h3>
            <p className={styles.ProfileUserLogin}>{user?.login}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          
          <div className="mb-16">
            <Input
              label={t('firstName')}
              onChange={handleChange}
              value={values.firstName}
              name='firstName'
              placeholder={t('enterName')}
              isInvalid={Boolean(values.errors?.firstName)}
              error={values.errors?.firstName}
            />
          </div>
          
          <div className="mb-16">
            <Input
              label={t('lastName')}
              onChange={handleChange}
              value={values.lastName}
              name='lastName'
              placeholder={t('enterLastName')}
              isInvalid={Boolean(values.errors?.lastName)}
              error={values.errors?.lastName}
            />
          </div>
          
          <div className={styles.ProfileButtonWrapper}>
            <div className="mt-32">
              <Button
                onClick={handleSubmit}
                text={t('save')}
                disabled={Object.values(values.errors).length > 0 || hasNoChange || isLoading}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
