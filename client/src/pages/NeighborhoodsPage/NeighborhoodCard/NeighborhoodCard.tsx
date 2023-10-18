import React from 'react';
import { INeighborhood, NeighborhoodRoleEnum } from '@src/types/neighborhood.types';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import { EntityId } from '@reduxjs/toolkit';
import { removeNeighborhoodFavorite, setNeighborhoodFavorite } from '@src/store/userNeighborhoods/thunks';
import styles from './NeighborhoodCard.module.scss';

type Props = {
  neighborhoodId: EntityId,
}

const NeighborhoodCard: React.FC<Props> = ({ neighborhoodId }) => {
  const neighborhood = useAppSelector((state) => state.userNeighborhoods.entities[neighborhoodId]) as INeighborhood;
  const { name, _id, avatar, role } = neighborhood;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  const handleNavigate = () => {
    navigate(`/neighborhoods/${_id}`);
  };
  
  const handleFavoriteClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    if (!neighborhood.isFavorite) {
      dispatch(setNeighborhoodFavorite(neighborhood._id));
    } else {
      dispatch(removeNeighborhoodFavorite(neighborhood._id));
    }
  };
  
  return (
    <li className={styles.NeighborhoodCard} onClick={handleNavigate}>
      
      <span
        className={cn(
          !neighborhood.isFavorite && 'icon-star',
          neighborhood.isFavorite && 'icon-star-filled',
          neighborhood.isFavorite && styles.NeighborhoodFavoriteIconFilled,
          styles.NeighborhoodFavoriteIcon,
        )}
        onClick={handleFavoriteClick}
      />
      
      <div className={styles.NeighborhoodInfo}>
        {!avatar && (
          <div className={styles.NeighborhoodAvatarFiller}>
            <span className='icon-house-big'/>
          </div>
        )}
        <h3 className={styles.NeighborhoodTitle}>{name}</h3>
      </div>
      <div className={cn(
        styles.NeighborhoodRoleTag,
        role === NeighborhoodRoleEnum.admin && styles.NeighborhoodRoleTagAdmin,
        role === NeighborhoodRoleEnum.member && styles.NeighborhoodRoleTagMember,
      )}
      >
        {t(role)}
      </div>
    </li>
  );
};

export default NeighborhoodCard;
