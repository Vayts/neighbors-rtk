import React, { useEffect, useState } from 'react';
import Input from '@src/components/UI/Input/Input';
import { useTranslation } from 'react-i18next';
import Button from '@src/components/UI/Button/Button';
import { ICreatePlanTask } from '@src/types/plan.types';
import { getPlanTaskValidation } from '@src/validation/createPlan.validation';
import { v4 as uuid } from 'uuid';
import ErrorMessage from '@src/components/UI/ErrorMessage/ErrorMessage';
import cn from 'classnames';
import styles from './PlanTaskList.module.scss';

type Props = {
  tasks: ICreatePlanTask[],
  onAddTask: (value: ICreatePlanTask) => void,
  onDeleteTask: (value: string) => void,
}

const PlanTaskList: React.FC<Props> = ({ onDeleteTask, tasks, onAddTask }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const { t } = useTranslation();
  
  useEffect(() => {
    setError(getPlanTaskValidation(value));
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setError(getPlanTaskValidation(e.target.value));
    setTouched(true);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask({
      text: value.trim(),
      id: uuid(),
    });
    setValue('');
    setError('');
    setTouched(false);
  };
  
  const handleDelete = (e: React.MouseEvent<HTMLSpanElement>) => {
    const target = e.target as HTMLElement; // Явно указываем тип
    const id = target.dataset.id as string;
    
    onDeleteTask(id);
  };
  
  return (
    <>
      <div className={cn(styles.PlanTasksWrapper, error && styles.PlanTasksWrapperInvalid, !tasks.length && styles.PlanTasksWrapper)}>
        <p className={styles.PlanTaskLabel}>{t('additionalTasks')}</p>
        <ol className={styles.PlanTaskList}>
          {tasks.map((item) => {
            return (
              <li key={item.id} className={styles.PlanTaskItem}>
                <p>{item.text}</p>
                <span
                  className='icon-cross'
                  data-id={item.id}
                  onClick={handleDelete}
                />
              </li>
            );
          })}
        </ol>
        <Input
          onChange={handleChange}
          value={value}
          name='text'
          placeholder={t('enterText')}
          error={error}
          isInvalid={Boolean(error)}
        />
        <div className={styles.PlanButtonWrapper}>
          <Button
            disabled={Boolean(error) || !touched}
            onClick={handleSubmit}
            text={t('add')}
          />
        </div>
      </div>
      {Boolean(!tasks.length) && <ErrorMessage text={t('atLeastOneTask')}/>}
    </>
  );
};

export default PlanTaskList;
