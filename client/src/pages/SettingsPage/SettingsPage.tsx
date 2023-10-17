import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import Button from '@src/components/UI/Button/Button';
import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import { ILocale } from '@src/types/locale.types';
import i18n from 'i18next';
import { setLanguage } from '@src/store/core/slice';
import styles from './SettingsPage.module.scss';

const SettingsPage: React.FC = () => {
  const currentLocale = useAppSelector((state) => state.core.locale);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  const changeLanguageHandler = () => {
    const newLocale = currentLocale === ILocale.uk ? ILocale.en : ILocale.uk;
    i18n.changeLanguage(newLocale)
      .then(() => {
        dispatch(setLanguage(newLocale));
      })
      .then(() => {
        window.localStorage.setItem('neighbors_lang', newLocale);
      });
  };
  
  const handleNavigateToChangePassword = () => {
    navigate('change-password');
  };
  
  return (
    <div className={styles.SettingsPageWrapper}>
      <div className={styles.SettingsPageContent}>
        <div className={styles.SettingsBlock}>
          <span className={cn(styles.SettingsIcon, 'icon-language')}/>
          <div className={styles.SettingsTextWrapper}>
            <h3 className={styles.SettingsTitle}>{t('language')}</h3>
            <p className={styles.SettingsText}>{t(currentLocale)}</p>
          </div>
          <div className={styles.SettingsButtonWrapper}>
            <Button
              onClick={changeLanguageHandler}
              text={t('change')}
            />
          </div>
        </div>
        <div className={styles.SettingsBlock}>
          <span className={cn(styles.SettingsIcon, 'icon-lock')}/>
          <div className={styles.SettingsTextWrapper}>
            <h3 className={styles.SettingsTitle}>{t('password')}</h3>
            <p className={styles.SettingsText}>•••••••••</p>
          </div>
          <div className={styles.SettingsButtonWrapper}>
            <Button
              onClick={handleNavigateToChangePassword}
              text={t('change')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
