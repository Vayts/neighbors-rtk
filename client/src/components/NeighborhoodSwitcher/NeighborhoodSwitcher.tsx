import React, { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { getFavoriteNeighborhoods } from '@helpers/neighborhood.helper';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { selectAllNeighborhoods } from '@src/store/userNeighborhoods/selectors';
import { useAppSelector } from '@src/hooks/hooks';
import styles from './NeighborhoodSwitcher.module.scss';

type Props = {
  link: string,
}

const NeighborhoodSwitcher: React.FC<Props> = ({ link }) => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('neighborhood_id');
  const [selected, setSelected] = useState(id || '');
  const neighborhoods = useAppSelector(selectAllNeighborhoods);
  const favoriteNeighborhoods = useMemo(() => getFavoriteNeighborhoods(neighborhoods, id),
    [neighborhoods, id]);
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  useEffect(() => {
    if (!id) {
      setSelected('');
    }
  }, [id]);
  
  const handleNeighborhoodNavigate = (id: string) => {
    setSelected(id);
    navigate(`${link}?neighborhood_id=${id}`);
  };
  
  const handleAllNavigate = () => {
    if (selected !== '') {
      setSelected('');
      navigate(link);
    }
  };
  
  return (
    <div className={styles.SwitcherWrapper}>
      <div
        className={cn(styles.SwitcherButton, !selected && styles.SwitcherButtonSelected)}
        onClick={handleAllNavigate}
      >
        {t('switcherAll')}
      </div>
      {favoriteNeighborhoods.map((item) => {
        return (
          <div
            className={cn(styles.SwitcherButton, selected === item._id && styles.SwitcherButtonSelected)}
            onClick={() => handleNeighborhoodNavigate(item._id)}
            key={item._id}
          >
            {item.name}
          </div>
        );
      })}
    </div>
  );
};

export default NeighborhoodSwitcher;
