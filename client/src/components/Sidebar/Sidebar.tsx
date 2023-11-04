import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import UserDropdown from '@src/components/UserDropdown/UserDropdown';
import { STATIC_HREF } from '@constants/core';
import styles from './Sidebar.module.scss';

const LINKS = [
  {
    link: '/neighborhoods',
    icon: 'icon-neighborhoods',
    text: 'neighborhoodsLink',
  },
  {
    link: '/debts',
    icon: 'icon-debts',
    text: 'debts',
  },
  {
    link: '/plans',
    icon: 'icon-plans',
    text: 'plans',
  },
  {
    link: '/duties',
    icon: 'icon-duty',
    text: 'duties',
  },
  {
    link: '/chats',
    icon: 'icon-chat',
    text: 'chats',
  },
];

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
        {LINKS.map((item) => {
          return (
            <NavLink
              key={`sidebar-${item.text}`}
              to={item.link}
              className={({ isActive }) => cn(styles.SidebarNavItem, isActive && styles.SidebarNavItemActive)}
            >
              <span className={item.icon} />
              <p className={styles.SidebarNavText}>{t(item.text)}</p>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
