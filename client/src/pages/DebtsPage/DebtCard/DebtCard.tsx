import React, { memo } from 'react';
import { IDebt } from '@src/types/debt.types';
import ProgressBar from '@src/components/ProgressBar/ProgressBar';
import cn from 'classnames';
import { Tooltip } from 'react-tooltip';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@src/hooks/hooks';
import { Menu } from '@src/components/UI/Menu/Menu';
import DateRange from '@src/components/DateRange/DateRange';
import { selectUser } from '@src/store/auth/selectors';
import { STATIC_HREF } from '@constants/core';
import DebtMenu from '@src/pages/DebtsPage/DebtCard/DebtMenu/DebtMenu';
import styles from './DebtCard.module.scss';

type Props = {
  debt: IDebt,
  onClick?: (debt: IDebt) => void,
}

const DebtCard: React.FC<Props> = ({ debt, onClick }) => {
  const { debtAmount, repaidAmount, _id, text } = debt;
  const user = useAppSelector(selectUser);
  const neighborhood = useAppSelector((state) => state.neighborhoods.entities[debt.neighborhood]);
  const author = useAppSelector((state) => state.debtors.entities[debt.author]);
  const debtor = useAppSelector((state) => state.debtors.entities[debt.debtor]);
  const isRepaid = repaidAmount >= debtAmount;
  
  const { t } = useTranslation();
  
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    
    if (onClick) {
      onClick(debt);
    }
  };
  
  return (
    <li className={styles.DebtWrapper}>
      {
        author._id === user._id && (
          <div className={styles.DebtMenuWrapper}>
            <Menu>
              <DebtMenu debt={debt}/>
            </Menu>
          </div>
        )
      }
      
      <div className={styles.DebtContent} onClick={handleClick}>
        <div className={styles.DebtMainContent}>
          
          <div className={styles.DebtAvatars}>
            <img
              data-tooltip-id={`${_id}-author`}
              className={cn(
                styles.DebtAuthorAvatar,
                user?._id === author._id && styles.DebtAuthorAvatarUser,
              )}
              src={`${STATIC_HREF}/${author.avatar}`}
              alt={`${author.fullName} avatar`}
            />
            <img
              data-tooltip-id={`${_id}-debtor`}
              className={cn(
                styles.DebtDebtorAvatar,
                user?._id === debtor._id && styles.DebtAuthorAvatarUser,
              )}
              src={`${STATIC_HREF}/${debtor.avatar}`}
              alt={`${debtor.fullName} avatar`}
            />
          </div>
          
          <p className={styles.DebtText}>{text}</p>
        </div>
        
        <div className={styles.DebtBottomContent}>
          
          <div className={styles.DebtProgressBarWrapper}>
            <ProgressBar
              total={debtAmount}
              current={repaidAmount}
              currency={neighborhood.currency}
            />
          </div>
          
          <div className={styles.DebtDates}>
            <DateRange
              end={debt.dueDate}
              start={debt.createdAt}
              withOverdue={!isRepaid}
            />
          </div>
        
        </div>
        
        <Tooltip
          style={{
            zIndex: 100,
          }}
          id={`${_id}-debtor`}
          place="bottom"
          content={`${t('debtor')}: ${debtor.fullName}`}
        />
        <Tooltip
          style={{
            zIndex: 100,
          }}
          id={`${_id}-author`}
          place="bottom"
          content={`${t('author')}: ${author.fullName}`}
        />
      </div>
    </li>
  );
};

export default memo(DebtCard);
