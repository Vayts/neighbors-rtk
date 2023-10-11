import React, { ChangeEvent, memo, useCallback, useId, useState } from 'react';
import { IInputProps } from '@src/components/UI/Input/types';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import ErrorMessage from '@src/components/UI/ErrorMessage/ErrorMessage';
import styles from './Input.module.scss';

const Input: React.FC<IInputProps> = (props) => {
  const {
    label,
    name,
    isSecure,
    disabled,
    onChange,
    placeholder,
    value,
    refValue,
    error,
    isInvalid,
  } = props;
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState(false);
  const showError = error && touched;
  const id = useId();
  const { t } = useTranslation();
  
  const handleBlur = useCallback(() => {
    setTouched(true);
  }, []);
  
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    setTouched(true);
  }, []);
  
  const toggleShow = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setShow(!show);
  }, [show]);
  
  return (
    <div className={styles.InputWrapper}>
      {label && (
        <label htmlFor={id} className={styles.InputLabel}>{label as string}</label>
      )}
      <div className={styles.InputHolder}>
        <input
          id={id}
          ref={refValue || null}
          name={name}
          className={cn(
            styles.InputElem,
            isInvalid && touched ? styles.InputElemInvalid : '',
            isSecure ? styles.InputElemSecured : '',
          )}
          disabled={disabled}
          value={value}
          type={isSecure ? show ? 'text' : 'password' : 'text'}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder as string || t('enterSomething')}
        />
        {isSecure && (
          <span
            className={cn(styles.InputSecureIcon, {
              'icon-show': show,
              'icon-hide': !show,
            })}
            onClick={toggleShow}
          />
        )}
      </div>
      {showError && <ErrorMessage text={error}/>}
    </div>
  );
};

export default memo(Input);
