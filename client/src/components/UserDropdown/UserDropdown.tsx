import React, { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import cn from 'classnames';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOutsideClick } from '@src/hooks/useOutsideClick';
import { selectUser } from '@src/store/auth/selectors';
import { STATIC_HREF } from '@constants/core';
import { logout } from '@src/store/auth/thunks';
import styles from './UserDropdown.module.scss';

const UserDropdown: React.FC = () => {
  const [isOpen, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  const handleToggleOpen = () => {
    setOpen(!isOpen);
  };
  
  const handleCloseDropdown = () => {
    setOpen(false);
  };
  
  useOutsideClick(ref, handleCloseDropdown);
  
  return (
    user && (
      <div
        className={styles.UserDropdownWrapper}
        onClick={handleToggleOpen}
        ref={ref}
      >
        <div className={styles.UserDropDownButton}>
          <img className={styles.UserAvatar} src={`${STATIC_HREF}/${user?.avatar}`} alt={`${user?.fullName} avatar`}/>
          <div className={styles.UserContent}>
            <p className={styles.UserFullName}>
              {user.fullName}
            </p>
            <div className={styles.UserControls}>
              <span className={cn('icon-down', styles.UserControlsIconDown, !isOpen && styles.UserControlsIconDownActive)}/>
              <span className={cn('icon-up', styles.UserControlsIconUp, isOpen && styles.UserControlsIconUpActive)}/>
            </div>
          </div>
        </div>
        <nav className={cn(styles.UserDropDownContent, isOpen && styles.UserDropDownContentActive)}>
          <ul className={styles.UserDropDownList}>
            <li>
              <NavLink className={({ isActive }) => (isActive ? cn(styles.UserDropDownNavLink, styles.UserDropDownNavLinkActive) : styles.UserDropDownNavLink)} to='/profile'>
                <span className='icon-profile'/>
                <span>{t('personalInfo')}</span>
              </NavLink>
            </li>
            <li>
              <NavLink className={styles.UserDropDownNavLink} to='/profile'>
                <span className='icon-settings'/>
                <span>{t('settings')}</span>
              </NavLink>
            </li>
            <li>
              <div className={styles.UserDropDownNavLink} onClick={handleLogout}>
                <span className='icon-logout'/>
                <span>{t('logout')}</span>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    )
  );
};

export default UserDropdown;
