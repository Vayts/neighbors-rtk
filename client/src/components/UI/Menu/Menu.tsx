import React, { useRef, useState } from 'react';
import { IMenu } from '@src/components/UI/Menu/types';
import { useOutsideClick } from '@src/hooks/useOutsideClick';
import cn from 'classnames';
import styles from './Menu.module.scss';

export const Menu: React.FC<IMenu> = ({ icon, children }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState(false);
	
  useOutsideClick(menuRef, () => setOpen(false));
  
  const openMenuHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!isOpen) {
      setOpen(true);
    }
  };
	
  return (
    <div ref={menuRef} className={cn(styles.MenuWrapper, isOpen && styles.MenuWrapperOpen)}>
      <span className={cn(icon || 'icon-menu-dots', styles.MenuIcon)} onClick={openMenuHandler}/>
      <div className={cn(styles.MenuContent, isOpen && styles.MenuContentOpen)}>
        {children}
      </div>
    </div>
  );
};
