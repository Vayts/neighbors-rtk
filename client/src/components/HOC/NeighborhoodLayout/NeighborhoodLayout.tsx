import React, { useEffect } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import {
  selectCurrentNeighborhood,
  selectCurrentNeighborhoodErrors,
  selectCurrentNeighborhoodIsLoading,
} from '@src/store/currentNeighborhood/selectors';
import { getCurrentNeighborhoodRequest } from '@src/store/currentNeighborhood/actions';
import { NEIGHBORHOOD_ERRORS } from '@constants/errors';
import { setCurrentNeighborhoodErrors } from '@src/store/currentNeighborhood/reducer';
import Loader from '@src/components/Loader/Loader';

const NeighborhoodLayout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('neighborhood_id');
  const neighborhood = useAppSelector(selectCurrentNeighborhood);
  const errors = useAppSelector(selectCurrentNeighborhoodErrors);
  const isLoading = useAppSelector(selectCurrentNeighborhoodIsLoading);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const showOutlet = isLoading && !neighborhood;
  
  useEffect(() => {
    if (!id) {
      navigate('/neighborhoods');
    } else if (neighborhood?._id !== id) {
      dispatch(getCurrentNeighborhoodRequest(id));
    }
  }, [id]);
  
  useEffect(() => {
    if (errors.includes(NEIGHBORHOOD_ERRORS.NO_ACCESS)) {
      navigate('/neighborhoods');
      
      return () => {
        dispatch(setCurrentNeighborhoodErrors([]));
      };
    }
  }, [errors]);
  
  return (
    <>
      {showOutlet ? <Loader/> : <Outlet/>}
    </>
  );
};

export default NeighborhoodLayout;
