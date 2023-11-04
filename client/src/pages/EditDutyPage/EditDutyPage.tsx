import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import { IEditDuty } from '@src/types/duty.types';
import { useTranslation } from 'react-i18next';
import { CustomDateEventChange } from '@src/types/default.types';
import { getEditDutyValidation } from '@src/validation/createDuty.validation';
import BackButton from '@src/components/BackButton/BackButton';
import Input from '@src/components/UI/Input/Input';
import Button from '@src/components/UI/Button/Button';
import { getEditDutyDto } from '@helpers/duties.helper';
import { editDuty } from '@src/store/duties/thunks';
import styles from './EditDutyPage.module.scss';

const EditDutyPage: React.FC = () => {
  const { dutyId } = useParams();
  const dutyForEdit = useAppSelector((state) => state.duties.entities[dutyId]);
  const [searchParams] = useSearchParams();
  const id = searchParams.get('neighborhood_id');
  const [values, setValues] = useState<IEditDuty>({
    name: dutyForEdit ? dutyForEdit.name : '',
    errors: {},
  });
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  useEffect(() => {
    if (!dutyId || !dutyForEdit) {
      navigate(`/duties${id ? `?neighborhood_id=${id}` : ''}`);
    }
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
        errors: getEditDutyValidation(newState),
      };
    });
  }, []);
  
  const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!Object.values(values.errors).length) {
      setLoading(true);
      const dto = getEditDutyDto(values);
      dispatch(editDuty({ id: dutyId, values: dto }))
        .then(() => {
          navigate(`/duties${id ? `?neighborhood_id=${id}` : ''}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  
  return (
    <div className={styles.EditDutyPageWrapper}>
      <div className={styles.EditDutyFormWrapper}>
        <div className={styles.EditDutyTitleWrapper}>
          <div className={styles.EditDutyBack}>
            <BackButton/>
          </div>
          <h3 className={styles.EditDutyTitle}>{t('editDuty')}</h3>
        </div>
        <form className={styles.EditDutyForm}>
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
            <Button
              onClick={handleSubmit}
              text={t('edit')}
              disabled={Boolean(Object.values(values.errors).length) || isLoading}
            />
          </div>
        </form>
      </div>
    
    </div>
  );
};

export default EditDutyPage;
