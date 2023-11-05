import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Input from '@src/components/UI/Input/Input';
import cn from 'classnames';
import Button from '@src/components/UI/Button/Button';
import { NavLink, useNavigate } from 'react-router-dom';
import { getRegisterValidation } from '@src/validation/auth.validation';
import { IRegister } from '@src/types/auth.types';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import { selectAuthLoading, selectUser } from '@src/store/auth/selectors';
import { register } from '@src/store/auth/thunks';
import { STATIC_HREF } from '@constants/core';
import { useScrollTopOnMount } from '@src/hooks/useScrollTopOnMount';
import { errorManager } from '@helpers/errors.helper';
import { ErrorEnum } from '@src/types/default.types';
import styles from './RegisterPage.module.scss';

const initialValue: IRegister = {
  firstName: '',
  lastName: '',
  login: '',
  password: '',
  errors: {},
};

const RegisterPage: React.FC = () => {
  useScrollTopOnMount();
  const [values, setValues] = useState(initialValue);
  const isLoading = useAppSelector(selectAuthLoading);
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);
  
  useEffect(() => {
    setValues((prev) => {
      return {
        ...prev,
        errors: getRegisterValidation(prev),
      };
    });
  }, []);
  
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setValues((prev) => {
      const newState = {
        ...prev,
        [name]: value,
      };
      
      return {
        ...newState,
        errors: getRegisterValidation(newState),
      };
    });
  }, []);
  
  const handleSubmit = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(register(values))
      .unwrap()
      .catch((e) => errorManager(e, ErrorEnum.auth));
  }, [values]);
  
  return (
    <div className={styles.RegisterPageWrapper}>
      <div className={styles.RegisterContentWrapper}>
        <h2 className={cn(styles.RegisterTitle, 'mb-40')}>{t('signUp')}</h2>
        <div className={styles.RegisterPageFormWrapper}>
          <div className={styles.RegisterBanner}>
            <div className={styles.RegisterBannerContent}>
              <h3 className={styles.RegisterBannerTitle}>{t('registerBannerText')}</h3>
              <ul className={styles.RegisterBannerList}>
                <li className={styles.RegisterBannerItem}>
                  <span className='icon-check'/>
                  {t('registerTextUnite')}
                </li>
                <li className={styles.RegisterBannerItem}>
                  <span className='icon-check'/>
                  {t('registerTextTasks')}
                </li>
                <li className={styles.RegisterBannerItem}>
                  <span className='icon-check'/>
                  {t('registerTextEvents')}
                </li>
                <li className={styles.RegisterBannerItem}>
                  <span className='icon-check'/>
                  {t('registerTextDebts')}
                </li>
              </ul>
            </div>
            <img src={`${STATIC_HREF}/banner5.png`} alt='register banner'/>
          </div>
          <form className={styles.RegisterPageForm}>
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
            <div className="mb-16">
              <Input
                label={t('login')}
                onChange={handleChange}
                value={values.login}
                name='login'
                placeholder={t('enterLogin')}
                isInvalid={Boolean(values.errors?.login)}
                error={values.errors?.login}
              />
            </div>
            <div className="mb-32">
              <Input
                label={t('password')}
                onChange={handleChange}
                value={values.password}
                name='password'
                placeholder={t('createPassword')}
                isInvalid={Boolean(values.errors?.password)}
                error={values.errors?.password}
                isSecure
              />
            </div>
            <div className='mb-16'>
              <Button
                disabled={Object.keys(values.errors).length > 0 || isLoading}
                onClick={handleSubmit}
                text={t('signUp')}
              />
            </div>
            <p className={styles.RegisterBottomText}>
              {t('alreadyHaveAnAccount')}
              <NavLink to='/login'>{t('signIn')}</NavLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
