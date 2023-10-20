import React from 'react';
import { Outlet } from 'react-router-dom';
import { STATIC_HREF } from '@constants/core';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import cn from 'classnames';
import { LocaleEnum } from '@src/types/locale.types';
import i18n from 'i18next';
import { setLanguage } from '@src/store/core/slice';
import styles from './AuthLayout.module.scss';

const AuthLayout: React.FC = () => {
  const locale = useAppSelector((state) => state.core.locale);
  const dispatch = useAppDispatch();
  
  const changeLanguageHandler = (value: LocaleEnum) => {
    if (value !== locale) {
      i18n.changeLanguage(value)
        .then(() => {
          dispatch(setLanguage(value));
        })
        .then(() => {
          window.localStorage.setItem('neighbors_lang', value);
        });
    }
  };
  
  return (
    <div>
      <div className={styles.AuthHeader}>
        <div className={styles.AuthLogo}>
          <img src={`${STATIC_HREF}/logoBlack.svg`} alt='logo'/>
          <p className={styles.AuthLogoText}>Neighbors</p>
        </div>
        <div className={styles.AuthLanguageSwitcher}>
          <span
            onClick={() => changeLanguageHandler(LocaleEnum.uk)}
            className={cn(styles.AuthLanguageItem, locale === LocaleEnum.uk && styles.AuthLanguageItemSelected)}
          >
            UA
          </span>
          <span
            onClick={() => changeLanguageHandler(LocaleEnum.en)}
            className={cn(styles.AuthLanguageItem, locale === LocaleEnum.en && styles.AuthLanguageItemSelected)}
          >
            EN
          </span>
        </div>
      </div>
      <Outlet/>
    </div>
  );
};

export default AuthLayout;
