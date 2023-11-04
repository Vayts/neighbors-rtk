import React, { FC } from 'react';
import { ILoader } from '@src/components/Loader/types';
import { Oval } from 'react-loader-spinner';
import styles from './Loader.module.scss';

const Loader: FC<ILoader> = ({ size }) => (
  <div className={styles.LoaderWrapper}>
    <Oval
      color='#2C9E95'
      secondaryColor='#333a4a'
      height={40 || size}
      width={40 || size}
    />
  </div>
);

export default Loader;
