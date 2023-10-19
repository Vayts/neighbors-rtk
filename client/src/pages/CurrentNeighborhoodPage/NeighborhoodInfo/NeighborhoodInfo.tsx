import React, { useState } from 'react';
import { useAppSelector } from '@src/hooks/hooks';
import { INeighborhood } from '@src/types/neighborhood.types';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { selectMembersByIds } from '@src/store/members/selectors';
import MembersList from '@src/components/MembersList/MembersList';
import NeighborhoodMembersModal from '@src/pages/CurrentNeighborhoodPage/NeighborhoodMembersModal/NeighborhoodMembersModal';
import cn from 'classnames';
import Modal from '@src/components/Modal/Modal';
import InviteModal from '@src/pages/CurrentNeighborhoodPage/InviteModal/InviteModal';
import styles from './NeighborhoodInfo.module.scss';

const NeighborhoodInfo: React.FC = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const neighborhood = useAppSelector((state) => state.currentNeighborhood.neighborhood);
  const members = useAppSelector((state) => selectMembersByIds(state, neighborhood?.members));
  const { name, description, _id } = neighborhood as INeighborhood;
  const { t } = useTranslation();
  
  const handleOpenInviteModal = () => {
    setIsInviteModalOpen(true);
  };
  
  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
  };
  
  return (
    <div className={styles.InfoWrapper}>
      {isInviteModalOpen && (
        <Modal withCloseIcon outsideHandler={handleCloseInviteModal}>
          <InviteModal/>
        </Modal>
      )}
      <div className={styles.InfoContent}>
        <div className={styles.InfoAvatarFiller}>
          <span className='icon-neighborhoods'/>
        </div>
        <div className={styles.InfoTextWrapper}>
          <h3 className={styles.InfoName}>{name}</h3>
          <p className={styles.InfoDescription}>{description}</p>
        </div>
      </div>
      <div className={styles.InfoBottomContent}>
        <nav>
          <NavLink to={`/debts/${_id}`} className={styles.InfoNavigationItem}>
            {`${t('debts')}: ${neighborhood.debts}`}
          </NavLink>
          <NavLink to={`/plans/${_id}`} className={styles.InfoNavigationItem}>
            {`${t('plans')}: ${neighborhood.plans}`}
          </NavLink>
        </nav>
        <div className={styles.InfoMemberControls}>
          <MembersList members={members} modal={<NeighborhoodMembersModal members={members}/>}/>
          <span className={cn(styles.InfoInviteButton, 'icon-invite')} onClick={handleOpenInviteModal}/>
        </div>
        
      </div>
    </div>
  );
};

export default NeighborhoodInfo;
