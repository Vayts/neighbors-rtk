import React, { memo, useId } from 'react';
import { ICheckboxProps } from '@src/components/UI/Checkbox/types';
import cn from 'classnames';
import styles from './Checkbox.module.scss';

const Checkbox: React.FC<ICheckboxProps> = (props) => {
  const { label, name, onChange, checked, disabled } = props;
  const id = useId();
  
  const handleChange = () => {
    if (!disabled) {
      onChange(name, !checked);
    }
  };
  
  return (
    <div className={styles.CheckboxWrapper}>
      <label
        htmlFor={id}
        className={cn(
          styles.CheckboxLabel,
          disabled && checked && styles.CheckboxLabelDisabledChecked,
          disabled && styles.CheckboxLabelDisabled,
        )}
      >
        <div className={cn(styles.CheckboxCustom, checked && styles.CheckboxCustomChecked)}>
          <span className='icon-check'/>
        </div>
        <p className={styles.CheckboxText}>{label as string}</p>
      </label>
      <input
        type='checkbox'
        name={name}
        id={id}
        className={styles.CheckboxInput}
        onChange={handleChange}
        checked={checked}
      />
    </div>
  );
};

export default memo(Checkbox);
