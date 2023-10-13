import React from 'react';
import cn from 'classnames';
import { format } from 'date-fns';
import { IDateRange } from '@src/components/DateRange/types';
import styles from './DateRange.module.scss';

const DateRange: React.FC<IDateRange> = ({ end, start, withOverdue }) => {
  const isOverdue = end ? new Date() > new Date(end) : false;
  
  return (
    <div className={cn(
      styles.DateRange,
      withOverdue && isOverdue && styles.DateRangeOverdue,
    )}
    >
      <span>{format(new Date(start), 'dd.MM.yyyy')}</span>
      <span className={cn('icon-arrow-right', styles.DateRangeIcon)} />
      {end
        ? <span>{format(new Date(end), 'dd.MM.yyyy')}</span>
        : <span className={cn(styles.DateRangeInfinity, 'icon-infinity')} />}
    </div>
  );
};

export default DateRange;
