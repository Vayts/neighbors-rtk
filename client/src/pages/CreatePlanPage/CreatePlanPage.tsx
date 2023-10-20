import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import BackButton from '@src/components/BackButton/BackButton';
import Select from '@src/components/UI/Select/Select';
import TextArea from '@src/components/UI/TextArea/TextArea';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import {
  getMembersWithoutUser,
  getSelectArrFromNeighborhoods,
} from '@helpers/neighborhood.helper';
import { CustomDateEventChange } from '@src/types/default.types';
import Button from '@src/components/UI/Button/Button';
import DateInput from '@src/components/UI/DateInput/DateInput';
import Input from '@src/components/UI/Input/Input';
import { useNavigate, useParams } from 'react-router-dom';
import { ICreatePlan, ICreatePlanTask } from '@src/types/plan.types';
import Checkbox from '@src/components/UI/Checkbox/Checkbox';
import MembersCheckboxList from '@src/pages/CreatePlanPage/MembersCheckboxList/MembersCheckboxList';
import { getCreatePlanValidation } from '@src/validation/createPlan.validation';
import PlanTaskList from '@src/pages/CreatePlanPage/PlanTaskList/PlanTaskList';
import { getCreatePlanDto } from '@helpers/plans.helper';
import { selectAllNeighborhoods } from '@src/store/userNeighborhoods/selectors';
import { selectUser } from '@src/store/auth/selectors';
import { createPlan } from '@src/store/plans/thunks';
import styles from './CreatePlanPage.module.scss';

const initialValues: ICreatePlan = {
  neighborhood_id: '',
  description: '',
  name: '',
  eventDate: null,
  participants: [],
  paymentAmount: '',
  isPaymentRequired: false,
  tasksList: [],
  isTasksListRequired: false,
  isAllMembersInvited: true,
  errors: {},
};

const CreatePlanPage: React.FC = () => {
  const isInitialLoad = React.useRef<boolean>(true);
  const { id } = useParams();
  const [values, setValues] = useState<ICreatePlan>({
    ...initialValues,
    neighborhood_id: id || '',
    errors: getCreatePlanValidation(initialValues),
  });
  const [isLoading, setLoading] = useState(false);
  const neighborhoods = useAppSelector(selectAllNeighborhoods);
  const neighborhood = useAppSelector((state) => state.userNeighborhoods.entities[values.neighborhood_id]);
  const user = useAppSelector(selectUser);
  const neighborhoodsSelectArr = useMemo(() => getSelectArrFromNeighborhoods(neighborhoods), [neighborhoods]);
  const membersArr = useMemo(() => getMembersWithoutUser(neighborhood, user._id), [neighborhood]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  useEffect(() => {
    if (!isInitialLoad.current) {
      setValues((prev) => {
        return {
          ...prev,
          debtor_id: '',
          participants: [],
          isAllMembersInvited: true,
          errors: getCreatePlanValidation(prev),
        };
      });
    } else {
      isInitialLoad.current = false;
    }
  }, [values.neighborhood_id]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | CustomDateEventChange) => {
    const { name, value } = e.target;

    setValues((prev) => {
      const newState = {
        ...prev,
        [name]: value,
      };

      return {
        ...newState,
        errors: getCreatePlanValidation(newState),
      };
    });
  }, []);

  const handleCheckboxChange = useCallback((name: string, value: boolean) => {
    setValues((prev) => {
      const newState = {
        ...prev,
        [name]: value,
      };

      return {
        ...newState,
        errors: getCreatePlanValidation(newState),
      };
    });
  }, []);

  const handleMemberClick = useCallback((id: string) => {
    setValues((prev) => {
      const newState = {
        ...prev,
      };

      if (prev.participants.includes(id)) {
        newState.participants = prev.participants.filter((item) => item !== id);
      } else {
        newState.participants = [...prev.participants, id];
      }

      return {
        ...newState,
        errors: getCreatePlanValidation(newState),
      };
    });
  }, []);

  const handleAddTask = (value: ICreatePlanTask) => {
    setValues((prev) => {
      const newState = {
        ...prev,
        tasksList: [...prev.tasksList, value],
      };

      return {
        ...newState,
        errors: getCreatePlanValidation(newState),
      };
    });
  };

  const handleDeleteTask = (id: string) => {
    setValues((prev) => {
      const newState = {
        ...prev,
        tasksList: prev.tasksList.filter((item) => item.id !== id),
      };

      return {
        ...newState,
        errors: getCreatePlanValidation(newState),
      };
    });
  };

  const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!Object.values(values.errors).length) {
      const dto = getCreatePlanDto(values, membersArr);
      dispatch(createPlan(dto))
        .then(() => {
          navigate(`/plans${id ? `/${id}` : ''}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  
  return (
    <div className={styles.CreatePlanPageWrapper}>
      <div className={styles.CreatePlanFormWrapper}>
        <div className={styles.CreatePlanTitleWrapper}>
          <div className={styles.CreatePlanBack}>
            <BackButton/>
          </div>
          <h3 className={styles.CreatePlanTitle}>{t('createPlan')}</h3>
        </div>
        <form className={styles.CreatePlanForm}>
          <div className={styles.CreateSelectWrapper}>
            <Select
              value={values.neighborhood_id}
              onChange={handleChange}
              name='neighborhood_id'
              label={t('neighborhood')}
              placeholder={t('selectNeighborhood')}
              valuesArr={neighborhoodsSelectArr}
              isInvalid={Boolean(values.errors?.neighborhood_id)}
              error={values.errors?.neighborhood_id}
            />
          </div>
          <div className='mb-16'>
            <DateInput
              label={`${t('dateOfEvent')} (${t('optionalSmall')})`}
              value={values.eventDate}
              onChange={handleChange}
              name='eventDate'
              isInvalid={Boolean(values.errors?.eventDate)}
              error={values.errors?.eventDate}
              placeholder={t('selectDate')}
            />
          </div>
          <div className='mb-16'>
            <Input
              onChange={handleChange}
              value={values.name}
              name='name'
              label={t('planName')}
              placeholder={t('enterName')}
              error={values.errors?.name}
              isInvalid={Boolean(values.errors?.name)}
            />
          </div>
          <div className="mb-16">
            <TextArea
              onChange={handleChange}
              value={values.description}
              name='description'
              label={t('description')}
              placeholder={t('enterDescription')}
              error={values.errors?.description}
              isInvalid={Boolean(values.errors?.description)}
            />
          </div>
          <div className="mb-16">
            <Checkbox
              checked={values.isAllMembersInvited}
              onChange={handleCheckboxChange}
              name='isAllMembersInvited'
              label={t('allNeighborsInvited')}
            />
          </div>
          {!values.isAllMembersInvited && (
            <div className='mb-16'>
              <MembersCheckboxList
                members={membersArr}
                checkedArr={values.participants}
                onMemberSelect={handleMemberClick}
              />
            </div>
          )}
          <div className="mb-16">
            <Checkbox
              checked={values.isPaymentRequired}
              onChange={handleCheckboxChange}
              name='isPaymentRequired'
              label={t('needToRaiseMoney')}
            />
            {values.isPaymentRequired && (
              <div className='mt-16'>
                <Input
                  onChange={handleChange}
                  value={values.paymentAmount}
                  name='paymentAmount'
                  label={t('requiredAmount')}
                  placeholder={t('enterAmount')}
                  error={values.errors?.paymentAmount}
                  isInvalid={Boolean(values.errors?.paymentAmount)}
                />
              </div>
            )}
          </div>
          <div className="mb-32">
            <Checkbox
              checked={values.isTasksListRequired}
              onChange={handleCheckboxChange}
              name='isTasksListRequired'
              label={t('additionalTasksRequired')}
            />
            {values.isTasksListRequired && (
              <div className='mt-16'>
                <PlanTaskList
                  onAddTask={handleAddTask}
                  onDeleteTask={handleDeleteTask}
                  tasks={values.tasksList}
                />
              </div>
            )}
          </div>
          <div className="mb-16">
            <Button
              onClick={handleSubmit}
              text={t('create')}
              disabled={Boolean(Object.values(values.errors).length) || isLoading}
            />
          </div>
        </form>
      </div>
      
    </div>
  );
};

export default CreatePlanPage;
