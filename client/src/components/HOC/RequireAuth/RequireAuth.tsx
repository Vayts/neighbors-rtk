import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import Header from '@src/components/Header/Header';
import Sidebar from '@src/components/Sidebar/Sidebar';
import { selectUser } from '@src/store/auth/selectors';
import { getUserNeighborhoods } from '@src/store/userNeighborhoods/thunks';
import styles from './RequireAuth.module.scss';

const RequireAuth: React.FC = () => {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
	
  useEffect(() => {
    if (user) {
      dispatch(getUserNeighborhoods());
    }

    if (!user) {
      navigate('/login');
    }
  }, [user?._id]);
	
  return (
    <>
      <Header/>
      <Sidebar/>
      <div className={styles.ContentLayout}>
        <Outlet/>
      </div>
    </>
  );
};

export default RequireAuth;
