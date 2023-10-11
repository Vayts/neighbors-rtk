import React from 'react';
import { NavLink } from 'react-router-dom';
import UserDropdown from '@src/components/UserDropdown/UserDropdown';
import { STATIC_HREF } from '@constants/core';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  return (
    <header className={styles.HeaderWrapper}>
      <NavLink to='/' className={styles.HeaderLogo}>
        <img src={`${STATIC_HREF}/logo.svg`} alt='logo'/>
      </NavLink>
      <div className={styles.HeaderContentWrapper}>
        <UserDropdown/>
      </div>
    </header>
  );
};

export default Header;
