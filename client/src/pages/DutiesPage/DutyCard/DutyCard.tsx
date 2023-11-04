import React, { memo, useState } from 'react';
import Calendar from 'react-calendar';
import './Calendar.css';
import { IDuty, IDutyMark } from '@src/types/duty.types';
import Button from '@src/components/UI/Button/Button';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import { useParams } from 'react-router-dom';
import { isSameDay, parseISO } from 'date-fns';
import DutyMark from '@src/pages/DutiesPage/DutyCard/DutyMark/DutyMark';
import { useTranslation } from 'react-i18next';
import { addDutyMark } from '@src/store/duties/thunks';
import { errorManager } from '@helpers/errors.helper';
import { Menu } from '@src/components/UI/Menu/Menu';
import DutyMenu from '@src/pages/DutiesPage/DutyCard/DutyMenu/DutyMenu';
import { selectUser } from '@src/store/auth/selectors';
import styles from './DutyCard.module.scss';

type Props = {
  duty: IDuty,
}

const DutyCard: React.FC<Props> = ({ duty }) => {
  const { id } = useParams();
  const [value, setValue] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const user = useAppSelector(selectUser);
  const neighborhood = useAppSelector((state) => state.neighborhoods.entities[duty.neighborhood]);
  const currentDate = new Date();
  const nextMonth = new Date(currentDate.setMonth(currentDate.getMonth()));
  const prevMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
  const isAuthor = user?._id === duty.author;
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  
  const dayIsInMarks = (date: Date): IDutyMark | null => {
    let result = null;
    
    duty.dutyMarks.forEach((item) => {
      if (isSameDay(parseISO(item.date.toString()), date)) {
        result = item;
        
        return null;
      }
    });
    
    return result;
  };
  
  const generateTileContent = ({ date }: { date: Date}) => {
    if (duty?.dutyMarks?.length) {
      const result = dayIsInMarks(date);
      
      if (result) return <DutyMark dutyMark={result}/>;
    }
    
    return null;
  };
  
  const isTileDisabled = ({ date }: { date: Date}) => {
    return date < prevMonth || date > nextMonth;
  };
  
  const handleAddMark = () => {
    setLoading(true);
    dispatch(addDutyMark({
      date: value,
      duty_id: duty._id,
      neighborhood_id: duty.neighborhood.toString(),
    }))
      .unwrap()
      .catch(errorManager)
      .finally(() => {
        setLoading(false);
        setValue(null);
      });
  };
  
  return (
    <article className={styles.DutyWrapper}>
      <div className={styles.DutyContent}>
        
        <div className={styles.DutyMenuWrapper}>
          {isAuthor && (
            <Menu>
              <DutyMenu duty={duty}/>
            </Menu>
          )}
          
        </div>
        
        <div className={styles.DutyTitleWrapper}>
          <h3 className={styles.DutyTitle}>{duty.name}</h3>
          {!id && <h3 className={styles.DutyNeighborhoodName}>{neighborhood.name}</h3>}
        </div>
        <div className={styles.Calendar}>
          <Calendar
            onChange={(date) => {
              setValue(date);
            }}
            tileDisabled={isTileDisabled}
            tileContent={generateTileContent}
            value={value}
            showFixedNumberOfWeeks
            prev2Label={null}
            next2Label={null}
            maxDetail='month'
            view='month'
          />
        </div>
        <div className={styles.DutyButtonWrapper}>
          <Button
            onClick={handleAddMark}
            disabled={!value || isLoading || Boolean(dayIsInMarks(value))}
            text={t('addMark')}
          />
        </div>
      </div>
    </article>
  );
};

export default memo(DutyCard);
