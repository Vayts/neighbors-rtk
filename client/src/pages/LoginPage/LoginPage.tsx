import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Input from '@src/components/UI/Input/Input';
import Button from '@src/components/UI/Button/Button';
import { NavLink, useNavigate } from 'react-router-dom';
import cn from 'classnames';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import { ILogin } from '@src/types/auth.types';
import { selectAuthLoading, selectUser } from '@src/store/auth/selectors';
import { login } from '@src/store/auth/thunks';
import styles from './LoginPage.module.scss';

const initialValue: ILogin = {
  login: '',
  password: '',
  errors: {},
};

const LoginPage: React.FC = () => {
  const [values, setValues] = useState<ILogin>(initialValue);
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectAuthLoading);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);
  
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setValues((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }, []);
  
  const handleSubmit = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(login(values));
  }, [values]);
  
  return (
    <div className={styles.LoginPageWrapper}>
      <div className={styles.LoginContentWrapper}>
        <h2 className={cn(styles.LoginTitle, 'mb-40')}>{t('signIn')}</h2>
        <div className={styles.LoginFormWrapper}>
          <form className={styles.LoginForm}>
            <div className="mb-16">
              <Input
                label={t('login')}
                onChange={handleChange}
                value={values.login}
                name='login'
                placeholder={t('enterLogin')}
              />
            </div>
            <div className="mb-32">
              <Input
                label={t('password')}
                onChange={handleChange}
                value={values.password}
                name='password'
                placeholder={t('enterPassword')}
                isSecure
              />
            </div>
            <div className="mb-16">
              <Button
                onClick={handleSubmit}
                text={t('signIn')}
                disabled={!values.login || !values.password || isLoading}
              />
            </div>
            <p className={styles.LoginBottomText}>
              {t('dontHaveAnAccount')}
              <NavLink to='/register'>{t('signUpAction')}</NavLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
