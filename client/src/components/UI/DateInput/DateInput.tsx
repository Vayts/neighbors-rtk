import React, { memo, useId, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IDateInputProps } from '@src/components/UI/DateInput/types';
import cn from 'classnames';
import ErrorMessage from '@src/components/UI/ErrorMessage/ErrorMessage';
import styles from './DateInput.module.scss';

const DateInput: React.FC<IDateInputProps> = (props) => {
  const { label, name, value, error, isInvalid, placeholder, onChange } = props;
  const [touched, setTouched] = useState(false);
  const currentDate = new Date();
  const showError = error && touched;
  const id = useId();
  
  const handlePickDate = (date: Date) => {
    onChange({
      target: {
        name,
        value: new Date(date),
      },
    });
    setTouched(true);
  };
  
  const handleRemove = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    
    onChange({
      target: {
        name,
        value: null,
      },
    });
    setTouched(true);
  };

  return (
    <div className={styles.DateInputWrapper}>
      {label && (
        <label htmlFor={id} className={styles.DateInputLabel}>{label as string}</label>
      )}
      <div className={styles.DateInputElem}>
        <DatePicker
          selected={value || null}
          onChange={handlePickDate}
          className={cn(styles.DateInput, isInvalid && styles.DateInputInvalid)}
          calendarClassName={styles.DateInputCalendar}
          placeholderText={placeholder as string}
          minDate={currentDate}
          dateFormat='dd/MM/yyyy'
          id={id}
        />
        {value && <span className={cn(styles.DateRemoveIcon, 'icon-cross')} onClick={handleRemove}/>}
      </div>
      {showError && <ErrorMessage text={error as string}/>}
    </div>
  );
};

export default memo(DateInput);
