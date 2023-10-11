import React from 'react';
import { Outlet } from 'react-router-dom';
import { STATIC_HREF } from '@constants/core';
import styles from './AuthLayout.module.scss';

const AuthLayout: React.FC = () => {
  return (
    <div>
      <div className={styles.AuthHeader}>
        <img src={`${STATIC_HREF}/logoBlack.svg`} alt='logo'/>
        <p className={styles.AuthLogoText}>Neighbors</p>
      </div>
      <Outlet/>
    </div>
  );
};

export default AuthLayout;
