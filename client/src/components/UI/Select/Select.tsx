import React, { ChangeEvent, memo, useEffect, useRef, useState } from 'react';
import { ISelectProps, ISelectValue } from '@src/components/UI/Select/types';
import cn from 'classnames';
import SelectDropdown from '@src/components/UI/Select/SelectDropdown/SelectDropdown';
import ErrorMessage from '@src/components/UI/ErrorMessage/ErrorMessage';
import styles from './Select.module.scss';

const Select: React.FC<ISelectProps> = (props) => {
  const {
    name,
    value,
    isInvalid,
    label,
    onChange,
    placeholder,
    valuesArr,
    error,
    clearable,
    disabled,
  } = props;
  const selectRef = useRef(null);
  const [selectedValue, setSelectedValue] = useState<string | ISelectValue>('');
  const [isFocused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const showError = error && touched;
  
  useEffect(() => {
    const selectedItem = typeof valuesArr[0] === 'object'
      ? (valuesArr as ISelectValue[]).find((item) => item.value === value)
      : (valuesArr as string[]).find((item) => item === value);
    
    setSelectedValue(selectedItem || '');
  }, [value, valuesArr]);
  
  const handleCloseDropdown = () => {
    setFocused(false);
    
    if (!touched) {
      setTouched(true);
    }
  };
  
  const handleOpenDropdown = () => {
    if (!disabled) {
      setFocused(true);
    }
  };
  
  const handleToggleFocused = () => {
    if (isFocused) {
      handleCloseDropdown();
      return false;
    }
    handleOpenDropdown();
  };
  
  const handlePickOption = (e: React.MouseEvent<HTMLLIElement>) => {
    const newValue = (e.target as HTMLLIElement).dataset.value;
    
    onChange({
      target: {
        name,
        value: newValue,
      },
    } as ChangeEvent<HTMLInputElement>);
    setTouched(true);
    setFocused(false);
  };
  
  const handleRemove = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    
    onChange({
      target: {
        name,
        value: '',
      },
    } as ChangeEvent<HTMLInputElement>);
    setTouched(true);
    setFocused(false);
  };
  
  return (
    <div className={styles.SelectWrapper} ref={selectRef}>
      {label && <p className={styles.SelectLabel}>{label as string}</p>}
      
      <div
        className={cn(
          styles.Select,
          isInvalid && touched && !disabled ? styles.SelectInvalid : '',
          isFocused && styles.SelectFocused,
          disabled && styles.SelectDisabled,
        )}
        onClick={handleToggleFocused}
      >
        
        {selectedValue && (
          <>
            <div className={styles.SelectSelected}>
              {typeof selectedValue === 'object' ? selectedValue.text : selectedValue}
            </div>
            
          </>
          
        )}
        
        <div className={styles.SelectIcons}>
          {selectedValue && clearable && (
            <>
              <span className={cn(styles.SelectRemoveIcon, 'icon-cross')} onClick={handleRemove}/>
              <span className={styles.SelectIconDivider}/>
            </>
          )}
          <span
            className={cn(
              styles.SelectIcon,
              !isFocused && 'icon-down',
              isFocused && 'icon-up',
            )}
          />
        </div>
        
        {!selectedValue && (
          <div className={styles.SelectPlaceholder}>{placeholder as string}</div>
        )}
        {isFocused && (
          <SelectDropdown
            value={value}
            onClose={handleCloseDropdown}
            onClick={handlePickOption}
            valuesArr={valuesArr}
            ref={selectRef}
          />
        )}
        
      </div>
      
      {showError && !disabled && <ErrorMessage text={error}/>}
      
    </div>
  );
};

export default memo(Select);
