import React, { useCallback, useState } from 'react';
import Button from '@src/components/UI/Button/Button';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import Input from '@src/components/UI/Input/Input';
import { IChangePassword } from '@src/types/auth.types';
import { getChangePasswordValidation } from '@src/validation/auth.validation';
import BackButton from '@src/components/BackButton/BackButton';
import { changePassword } from '@src/store/auth/thunks';
import { useScrollTopOnMount } from '@src/hooks/useScrollTopOnMount';
import { errorManager } from '@helpers/errors.helper';
import { ErrorEnum } from '@src/types/default.types';
import styles from './ChangePasswordPage.module.scss';

const initialValues = {
  currentPassword: '',
  password: '',
  confirmPassword: '',
  errors: {},
};

const ChangePasswordPage: React.FC = () => {
  useScrollTopOnMount();
  const [values, setValues] = useState<IChangePassword>({
    ...initialValues,
    errors: getChangePasswordValidation(initialValues),
  });
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  const handleSubmit = () => {
    dispatch(changePassword(values))
      .unwrap()
      .catch((e) => errorManager(e, ErrorEnum.auth));
  };
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setValues((prev) => {
      const newState = {
        ...prev,
        [name]: value,
      };
      
      return {
        ...newState,
        errors: getChangePasswordValidation(newState),
      };
    });
  }, []);
  
  return (
    <div className={styles.ChangePasswordPageWrapper}>
      <div className={styles.ChangePasswordPageContent}>
        <div className="mb-16">
          <BackButton/>
        </div>
        <form>
          <h3 className={styles.ChangePasswordTitle}>{t('confirmCurrentPassword')}</h3>
          <div className='mb-16'>
            <Input
              onChange={handleChange}
              value={values.currentPassword}
              name='currentPassword'
              label={t('currentPasswordLabel')}
              placeholder={t('enterPassword')}
              isSecure
            />
          </div>
          <h3 className={styles.ChangePasswordTitle}>{t('setNewPassword')}</h3>
          <div className={styles.ChangePasswordInputsWrapper}>
            <div className='mb-16'>
              <Input
                onChange={handleChange}
                value={values.password}
                name='password'
                label={t('newPassword')}
                placeholder={t('enterNewPassword')}
                error={values.errors?.password}
                isInvalid={Boolean(values.errors?.password)}
                isSecure
              />
            </div>
            <div className='mb-16'>
              <Input
                onChange={handleChange}
                value={values.confirmPassword}
                name='confirmPassword'
                label={t('confirmPassword')}
                placeholder={t('enterNewPassword')}
                error={values.errors?.confirmPassword}
                isInvalid={Boolean(values.errors?.confirmPassword)}
                isSecure
              />
            </div>
          </div>
          <div className="mt-16">
            <Button
              onClick={handleSubmit}
              text={t('change')}
              disabled={isLoading || Boolean(Object.values(values.errors).length)}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
