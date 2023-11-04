import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import Button from '@src/components/UI/Button/Button';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import DebtsAside from '@src/pages/DebtsPage/DebtsAside/DebtsAside';
import DebtsList from '@src/pages/DebtsPage/DebtsList/DebtsList';
import { DebtsFilterEnum } from '@src/types/debt.types';
import Select from '@src/components/UI/Select/Select';
import { ISelectValue } from '@src/components/UI/Select/types';
import { getVisibleDebts } from '@helpers/debts.helper';
import { IUser } from '@src/types/user.types';
import NeighborhoodSwitcher from '@src/components/NeighborhoodSwitcher/NeighborhoodSwitcher';
import cn from 'classnames';
import { selectUser } from '@src/store/auth/selectors';
import { selectAllDebts } from '@src/store/debts/selectors';
import { getUserDebts } from '@src/store/debts/thunks';
import NoItemBanner from '@src/components/NoItemBanner/NoItemBanner';
import DebtSkeleton from '@src/pages/DebtsPage/DebtSkeleton/DebtSkeleton';
import DebtsAsideSkeleton from '@src/pages/DebtsPage/DebtsAsideSkeleton/DebtsAsideSkeleton';
import styles from './DebtsPage.module.scss';

enum DebtsViewMod {
  main = 'main',
  aside = 'aside',
}

const DebtsPage: React.FC = () => {
  const { id } = useParams();
  const [viewMod, setViewMod] = useState(DebtsViewMod.main);
  const [filter, setFilter] = useState<DebtsFilterEnum>(DebtsFilterEnum.active);
  const user = useAppSelector(selectUser);
  const debts = useAppSelector(selectAllDebts);
  const visibleDebts = useMemo(() => getVisibleDebts(debts, filter, user as IUser), [debts, filter, user]);
  const isLoading = useAppSelector((state) => state.debts.isLoading);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  useEffect(() => {
    if (!id) {
      dispatch(getUserDebts(''));
    } else {
      dispatch(getUserDebts(id));
    }
  }, [id]);
  
  const handleChangeViewToAside = () => {
    setViewMod(DebtsViewMod.aside);
  };
  
  const handleChangeViewToMain = () => {
    setViewMod(DebtsViewMod.main);
  };
  
  const handleNavigateToCreate = () => {
    if (!id) {
      navigate('/debts/create');
    } else {
      navigate(`/debts/create/${id}`);
    }
  };
  
  const DEBT_FILTERS: ISelectValue[] = [
    {
      text: t('all'),
      value: DebtsFilterEnum.all,
    },
    {
      text: t('active'),
      value: DebtsFilterEnum.active,
    },
    {
      text: t('closed'),
      value: DebtsFilterEnum.closed,
    },
    {
      text: t('overdue'),
      value: DebtsFilterEnum.overdue,
    },
    {
      text: t('myDebts'),
      value: DebtsFilterEnum.myDebts,
    },
    {
      text: t('myDebtors'),
      value: DebtsFilterEnum.myDebtors,
    },
  ];
  
  const handleSelectFilter = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value as DebtsFilterEnum);
  };
  
  return (
    <div className={styles.DebtsPageWrapper}>
      <div className={styles.DebtsControls}>
        <div className={styles.DebtsPageTitleWrapper}>
          <h3>{t('debts')}</h3>
          <NeighborhoodSwitcher link="/debts"/>
        </div>
        <div className={styles.DebtsButtons}>
          <div className={styles.DebtsFilter}>
            <Select
              value={filter}
              onChange={handleSelectFilter}
              name='debts_filter'
              placeholder={t('selectNeighborhood')}
              valuesArr={DEBT_FILTERS}
              disabled={!isLoading && Boolean(!debts.length)}
            />
          </div>
          <Button
            onClick={handleNavigateToCreate}
            text={t('createDebt')}
            icon='icon-plus'
          />
        </div>
      </div>
      
      <div className={styles.DebtsContentHolder}>
        {!isLoading && Boolean(!debts.length) && (
          <NoItemBanner
            link='debts'
            img='banner11.png'
            title='noDebtsBannerText'
            withIdText='noDebtsOrDebtorsInNeighborhoodText'
            noIdText='noDebtsOrDebtorsText'
            buttonText='createDebt'
          />
        )}
        
        <div className={styles.DebtsContentWrapper}>
          
          {isLoading && (
            <>
              <DebtSkeleton amount={4}/>
              <DebtsAsideSkeleton/>
            </>
          )}
          
          {!isLoading && Boolean(debts.length) && (
            <>
              <div className={styles.DebtsViewModControl}>
                <span
                  onClick={handleChangeViewToMain}
                  className={cn(styles.DebtsViewModItem, viewMod === DebtsViewMod.main && styles.DebtsViewModItemActive)}
                >
                  {t('debts')}
                </span>
                <span
                  onClick={handleChangeViewToAside}
                  className={cn(styles.DebtsViewModItem, viewMod === DebtsViewMod.aside && styles.DebtsViewModItemActive)}
                >
                  {t('other')}
                </span>
              </div>
              
              <div className={cn(
                styles.DebtsMainWrapper,
                viewMod === DebtsViewMod.main && styles.DebtsMainWrapperActive,
              )}
              >
                <DebtsList visibleDebts={visibleDebts}/>
              </div>
              <div className={cn(
                styles.DebtsAsideWrapper,
                viewMod === DebtsViewMod.aside && styles.DebtsAsideWrapperActive,
              )}
              >
                <DebtsAside/>
              </div>
            </>
          )}
        </div>
        
      </div>
    
    </div>
  );
};

export default DebtsPage;
