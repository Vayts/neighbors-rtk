import React, { forwardRef, RefObject } from 'react';
import cn from 'classnames';
import { ISelectValue } from '@src/components/UI/Select/types';
import { useOutsideClick } from '@src/hooks/useOutsideClick';
import { ISelectDropdownProps } from '@src/components/UI/Select/SelectDropdown/types';
import styles from './SelectDropdown.module.scss';

const SelectDropdown = forwardRef(({ onClose, valuesArr, value, onClick }: ISelectDropdownProps, ref) => {
  useOutsideClick(ref as RefObject<HTMLDivElement>, onClose);
  
  return (
    <ul className={styles.SelectDropdown}>
      {valuesArr.map((item) => {
        return (
          <li
            key={typeof item === 'object' ? item.value : item}
            data-value={typeof item === 'object' ? item.value : item}
            onClick={onClick}
            className={cn(
              styles.SelectItem,
              value === (item as ISelectValue)?.value && styles.SelectItemSelected,
              value === item && styles.SelectItemSelected,
            )}
          >
            {typeof item === 'object' ? item.text : item}
          </li>
        );
      })}
    </ul>
  );
});

export default SelectDropdown;
