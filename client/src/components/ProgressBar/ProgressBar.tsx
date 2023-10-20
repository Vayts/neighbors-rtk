import React, { useId, useMemo } from 'react';
import { CurrencySymbolEnum, CurrencyType } from '@src/types/default.types';
import { formatNumberWithK } from '@helpers/visual.helper';
import { Tooltip } from 'react-tooltip';
import styles from './ProgressBar.module.scss';

type Props = {
  total: number,
  current: number,
  currency: CurrencyType,
}

const ProgressBar: React.FC<Props> = ({ current, total, currency }) => {
  const id = useId();
  const percentage = Math.round((current / total) * 100);
  const formattedCurrent = useMemo(() => formatNumberWithK(total - current), [total, current]);
  
  const withStyle = {
    width: `${percentage > 100 ? 100 : percentage}%`,
  };
  
  return (
    <div className={styles.ProgressBarWrapper}>
      
      <div className={styles.ProgressBarLine}>
        <div className={styles.ProgressBarFiller} style={withStyle}>
          <span className={styles.ProgressBarPercentage}>{`${percentage}%`}</span>
        </div>
      </div>
      
      <div className={styles.ProgressBarTextWrapper}>
        <p className={styles.ProgressBarText} data-tooltip-id={`${id}-progress`} >{formattedCurrent}</p>
        <span className={styles.ProgressBarCurrency}>{CurrencySymbolEnum[currency]}</span>
      </div>
      
      <Tooltip
        id={`${id}-progress`}
        place="top"
        content={`${current} ${CurrencySymbolEnum[currency]} / ${total} ${CurrencySymbolEnum[currency]}`}
      />
      
    </div>
  );
};

export default ProgressBar;
