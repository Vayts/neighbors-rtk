import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import UserDropdown from '@src/components/UserDropdown/UserDropdown';
import { STATIC_HREF } from '@constants/core';
import styles from './Sidebar.module.scss';

const Sidebar: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();
  
  return (
    <aside className={cn(
      styles.SidebarWrapper,
      isSidebarOpen && styles.SidebarWrapperActive,
    )}
    >
      <div className={styles.SidebarHeader}>
        <NavLink to='/'>
          <img src={`${STATIC_HREF}/logo.svg`} alt='logo'/>
        </NavLink>
        <span
          className={cn(
            styles.SidebarMenuButton,
            isSidebarOpen ? 'icon-left' : 'icon-menu',
            isSidebarOpen && styles.SidebarMenuButtonActive,
          )}
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        />
      </div>
      <div className={styles.SidebarUser}>
        <UserDropdown/>
      </div>
      <nav className={styles.SidebarNav}>
        <NavLink
          to='/neighborhoods'
          className={({ isActive }) => cn(styles.SidebarNavItem, isActive && styles.SidebarNavItemActive)}
        >
          <span className='icon-neighborhoods' />
          <p className={styles.SidebarNavText}>{t('neighborhoodsLink')}</p>
        </NavLink>
        <NavLink
          to='/debts'
          className={({ isActive }) => cn(styles.SidebarNavItem, isActive && styles.SidebarNavItemActive)}
        >
          <span className='icon-debts' />
          <p className={styles.SidebarNavText}>{t('debts')}</p>
        </NavLink>
        <NavLink
          to='/plans'
          className={({ isActive }) => cn(styles.SidebarNavItem, isActive && styles.SidebarNavItemActive)}
        >
          <span className='icon-plans' />
          <p className={styles.SidebarNavText}>{t('plans')}</p>
        </NavLink>
        <NavLink
          to='/chats'
          className={({ isActive }) => cn(styles.SidebarNavItem, isActive && styles.SidebarNavItemActive)}
        >
          <span className='icon-chat' />
          <p className={styles.SidebarNavText}>{t('chats')}</p>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
