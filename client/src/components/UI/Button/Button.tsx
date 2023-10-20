import React, { memo } from 'react';
import { IButtonProps } from '@src/components/UI/Button/types';
import cn from 'classnames';
import styles from './Button.module.scss';

const Button: React.FC<IButtonProps> = ({ onClick, text, disabled, icon, isDanger, type }) => {
  return (
    <button
      className={cn(styles.ButtonElem, isDanger && styles.ButtonElemDanger)}
      disabled={disabled}
      onClick={onClick}
      type={type || 'button'}
    >
      {icon && <span className={cn(styles.ButtonIcon, icon)}/>}
      <span className={styles.ButtonText}>{text}</span>
    </button>
  );
};

export default memo(Button);
