import React, { ChangeEvent, memo, useCallback, useId, useState } from 'react';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import ErrorMessage from '@src/components/UI/ErrorMessage/ErrorMessage';
import { ITextAreaProps } from '@src/components/UI/TextArea/types';
import styles from './TextArea.module.scss';

const TextArea: React.FC<ITextAreaProps> = (props) => {
  const {
    label,
    name,
    onChange,
    placeholder,
    value,
    refValue,
    error,
    isInvalid,
  } = props;
  const [touched, setTouched] = useState(false);
  const showError = error && touched;
  const id = useId();
  const { t } = useTranslation();
  
  const handleBlur = useCallback(() => {
    setTouched(true);
  }, []);
  
  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
    setTouched(true);
  }, []);
  
  return (
    <div className={styles.TextAreaWrapper}>
      {label && (
        <label htmlFor={id} className={styles.TextAreaLabel}>{label as string}</label>
      )}
      <div className={styles.TextAreaHolder}>
        <textarea
          id={id}
          ref={refValue || null}
          name={name}
          className={cn(
            styles.TextAreaElem,
            isInvalid && touched ? styles.TextAreaElemInvalid : '',
          )}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder as string || t('enterSomething')}
        />
      </div>
      {showError && <ErrorMessage text={error}/>}
    </div>
  );
};

export default memo(TextArea);
