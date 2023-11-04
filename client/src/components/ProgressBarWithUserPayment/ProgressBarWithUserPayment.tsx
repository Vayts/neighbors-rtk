import React, { memo, useId, useMemo } from 'react';
import { formatNumberWithK } from '@helpers/visual.helper';
import { CurrencySymbolEnum } from '@src/types/default.types';
import { Tooltip } from 'react-tooltip';
import { getDataForProgressBar } from '@helpers/plans.helper';
import { useAppSelector } from '@src/hooks/hooks';
import { IUser } from '@src/types/user.types';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { IProgressBarWithUserPaymentProps } from '@src/components/ProgressBarWithUserPayment/types';
import { selectUser } from '@src/store/auth/selectors';
import styles from './ProgressBarWithUserPayment.module.scss';

const ProgressBarWithUserPayment: React.FC<IProgressBarWithUserPaymentProps> = (props) => {
  const {
    current,
    withoutText,
    big,
    total,
    currency,
    participantPayments,
  } = props;
  const id = useId();
  const user = useAppSelector(selectUser) as IUser;
  const [participantsPercentage, userPercentage, userPayment] = getDataForProgressBar(total, current, participantPayments, user?._id);
  const formattedCurrent = useMemo(() => formatNumberWithK(total - current), [total, current]);
  const { t } = useTranslation();
  
  const participantsWith = {
    width: `${participantsPercentage}%`,
  };
  
  const userWith = {
    width: `${userPercentage}%`,
    left: `${participantsPercentage}%`,
  };
  
  return (
    <div className={styles.ProgressBarWrapper}>
      
      <div className={cn(styles.ProgressBarLine, big && styles.ProgressBarLineBig)}>
        <div className={styles.ProgressBarFiller} style={participantsWith}>
          <span className={styles.ProgressBarPercentage}>{`${participantsPercentage + userPercentage}%`}</span>
        </div>
        <div data-tooltip-id={`${id}-user-payment`} className={styles.ProgressBarUserFiller} style={userWith} />
      </div>
      
      <Tooltip
        id={`${id}-user-payment`}
        place="top"
        content={`${t('yourPayment', { value: userPayment, percentage: userPercentage, currency: CurrencySymbolEnum[currency] })}`}
      />
      
      <Tooltip
        id={`${id}-progress`}
        place="top"
        content={`${current} ${CurrencySymbolEnum[currency]} / ${total} ${CurrencySymbolEnum[currency]}`}
      />
      
      {!withoutText && (
        <div className={styles.ProgressBarTextWrapper}>
          <p className={styles.ProgressBarText} data-tooltip-id={`${id}-progress`} >{formattedCurrent}</p>
          <span className={styles.ProgressBarCurrency}>{CurrencySymbolEnum[currency]}</span>
        </div>
      )}
    
    </div>
  );
};

export default memo(ProgressBarWithUserPayment);
