import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { STATIC_HREF } from '@constants/core';
import Button from '@src/components/UI/Button/Button';
import styles from './NoItemBanner.module.scss';

type Props = {
  withIdText: string,
  noIdText: string,
  buttonText: string,
  title: string,
  img: string,
  link: string,
}

const NoItemBanner: React.FC<Props> = ({
  img,
  noIdText,
  title,
  withIdText,
  buttonText,
  link,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleNavigateToCreate = () => {
    if (!id) {
      navigate(`/${link}/create`);
    } else {
      navigate(`/${link}/create/${id}`);
    }
  };
  
  return (
    <div className={styles.NoItemBannerWrapper}>
      <div className={styles.NoItemBannerContent}>
        <h3 className={styles.NoItemBannerTitle}>{t(title)}</h3>
        <img className={styles.NoItemBannerImg} src={`${STATIC_HREF}/${img}`} alt='no duties banner'/>
        <p className={styles.NoItemBannerText}>{t(id ? withIdText : noIdText)}</p>
        <div className={styles.NoItemBannerButtons}>
          <Button
            onClick={handleNavigateToCreate}
            text={t(buttonText)}
          />
        </div>
      </div>
    </div>
  );
};

export default NoItemBanner;
