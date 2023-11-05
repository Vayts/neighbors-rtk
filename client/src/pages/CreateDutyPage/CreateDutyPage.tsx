import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import BackButton from '@src/components/BackButton/BackButton';
import Select from '@src/components/UI/Select/Select';
import Input from '@src/components/UI/Input/Input';
import Button from '@src/components/UI/Button/Button';
import { CustomDateEventChange, ErrorEnum } from '@src/types/default.types';
import { ICreateDuty } from '@src/types/duty.types';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import { selectUser } from '@src/store/auth/selectors';
import { getMembersWithoutUser, getSelectArrFromNeighborhoods } from '@helpers/neighborhood.helper';
import { selectAllNeighborhoods } from '@src/store/userNeighborhoods/selectors';
import MembersCheckboxList from '@src/components/UI/MembersCheckboxList/MembersCheckboxList';
import Checkbox from '@src/components/UI/Checkbox/Checkbox';
import { getCreateDutyValidation } from '@src/validation/createDuty.validation';
import { useNavigate, useParams } from 'react-router-dom';
import { createDuty } from '@src/store/duties/thunks';
import { errorManager } from '@helpers/errors.helper';
import { getCreateDutyDto } from '@helpers/duties.helper';
import { useScrollTopOnMount } from '@src/hooks/useScrollTopOnMount';
import styles from './CreateDutyPage.module.scss';

const initialValues: ICreateDuty = {
  neighborhood_id: '',
  name: '',
  participants: [],
  isAllMembersInvited: true,
  errors: {},
};

const CreateDutyPage: React.FC = () => {
  useScrollTopOnMount();
  const { id } = useParams();
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState<ICreateDuty>({
    ...initialValues,
    neighborhood_id: id || '',
    errors: getCreateDutyValidation(initialValues),
  });
  const neighborhoods = useAppSelector(selectAllNeighborhoods);
  const neighborhood = useAppSelector((state) => state.userNeighborhoods.entities[values.neighborhood_id]);
  const user = useAppSelector(selectUser);
  const neighborhoodsSelectArr = useMemo(() => getSelectArrFromNeighborhoods(neighborhoods), [neighborhoods]);
  const membersArr = useMemo(() => getMembersWithoutUser(neighborhood, user?._id), [neighborhood]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  const handleCheckboxChange = useCallback((name: string, value: boolean) => {
    setValues((prev) => {
      const newState = {
        ...prev,
        [name]: value,
      };
      
      return {
        ...newState,
        errors: getCreateDutyValidation(newState),
      };
    });
  }, []);
  
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | CustomDateEventChange) => {
    const { name, value } = e.target;
    
    setValues((prev) => {
      const newState = {
        ...prev,
        [name]: value,
      };
      
      return {
        ...newState,
        errors: getCreateDutyValidation(newState),
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
        errors: getCreateDutyValidation(newState),
      };
    });
  }, []);
  
  const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!Object.values(values.errors).length) {
      const dto = getCreateDutyDto(values, membersArr);
      dispatch(createDuty(dto))
        .unwrap()
        .then(() => {
          navigate(`/duties${id ? `/${id}` : ''}`);
        })
        .catch((e) => {
          errorManager(e?.response?.data?.message, ErrorEnum.plan);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  
  return (
    <div className={styles.CreateDutyPageWrapper}>
      <div className={styles.CreateDutyFormWrapper}>
        <div className={styles.CreateDutyTitleWrapper}>
          <div className={styles.CreateDutyBack}>
            <BackButton/>
          </div>
          <h3 className={styles.CreateDutyTitle}>{t('createDuty')}</h3>
        </div>
        <form className={styles.CreateDutyForm}>
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
            <Input
              onChange={handleChange}
              value={values.name}
              name='name'
              label={t('dutyName')}
              placeholder={t('enterName')}
              error={values.errors?.name}
              isInvalid={Boolean(values.errors?.name)}
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
            <div className='mb-32'>
              <MembersCheckboxList
                members={membersArr}
                checkedArr={values.participants}
                onMemberSelect={handleMemberClick}
              />
            </div>
          )}
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

export default CreateDutyPage;
