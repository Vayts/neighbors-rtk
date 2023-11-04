import React from 'react';
import { IMember } from '@src/types/user.types';
import cn from 'classnames';
import { STATIC_HREF } from '@constants/core';
import styles from './MemberCheckboxItem.module.scss';

type Props = {
  member: IMember,
  checked: boolean,
  onClick: (id: string) => void;
}

const MemberCheckboxItem: React.FC<Props> = ({ onClick, member, checked }) => {
  const handleClick = () => {
    onClick(member._id);
  };
  
  return (
    <div className={styles.MemberLabel} onClick={handleClick}>
      <div className={cn(styles.MemberCustomCheckbox, checked && styles.MemberCustomCheckboxChecked)}>
        <span className='icon-check'/>
      </div>
      <div className={styles.MemberContent}>
        <img
          className={styles.MemberAvatar}
          src={`${STATIC_HREF}/${member.avatar}`}
          alt={`${member.fullName} avatar`}
        />
        <p className={styles.MemberName}>{member.fullName}</p>
      </div>
    </div>
  );
};

export default MemberCheckboxItem;
