import React from 'react';
import { IErrorMessageProps } from '@src/components/UI/ErrorMessage/types';
import styles from './ErrorMessage.module.scss';

const ErrorMessage: React.FC<IErrorMessageProps> = ({ text }) => {
  return (
    <div className={styles.ErrorWrapper}>
      <span className={styles.ErrorIcon}/>
      <p className={styles.ErrorText}>{text}</p>
    </div>
  );
};

export default ErrorMessage;
