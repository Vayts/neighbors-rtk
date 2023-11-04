import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorMessage from '@src/components/UI/ErrorMessage/ErrorMessage';
import cn from 'classnames';
import { EntityId } from '@reduxjs/toolkit';
import { useAppSelector } from '@src/hooks/hooks';
import { selectMembersByIds } from '@src/store/members/selectors';
import { IMember } from '@src/types/user.types';
import MemberCheckboxItem from '@src/components/UI/MembersCheckboxList/MemberCheckboxItem/MemberCheckboxItem';
import styles from './MembersCheckboxList.module.scss';

type Props = {
  members: EntityId[],
  checkedArr: string[],
  onMemberSelect: (id: string) => void,
}

const MembersCheckboxList: React.FC<Props> = ({ members, checkedArr, onMemberSelect }) => {
  const membersArr = useAppSelector((state) => selectMembersByIds(state, members));
  const { t } = useTranslation();
  
  return (
    <>
      <div className={cn(styles.MembersWrapper, !checkedArr.length && styles.MembersWrapperInvalid)}>
        <div className={styles.MemberNotification}>
          {Boolean(!members.length) && <ErrorMessage text={t('selectNeighborhoodWithMembers')}/>}
        </div>
        {membersArr.map((member: IMember) => {
          return (
            <MemberCheckboxItem
              key={member._id}
              member={member}
              onClick={onMemberSelect}
              checked={checkedArr.includes(member._id)}
            />
          );
        })}
      </div>
      {Boolean(!checkedArr.length) && Boolean(members.length) && <ErrorMessage text={t('atLeastOneParticipant')}/>}
    </>
  );
};

export default memo(MembersCheckboxList);
