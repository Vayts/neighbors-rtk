import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthLayout from '@hoc/AuthLayout/AuthLayout';
import RequireAuth from '@hoc/RequireAuth/RequireAuth';
import { useAppDispatch, useAppSelector } from '@src/hooks/hooks';
import LoginPage from '@src/pages/LoginPage/LoginPage';
import RegisterPage from '@src/pages/RegisterPage/RegisterPage';
import { appFirstLoad } from '@src/store/core/thunks';
import { selectAppLoading } from '@src/store/core/selectors';
import Loader from '@src/components/Loader/Loader';
import { withSuspense } from '@hoc/WithSuspense/WithSuspense';
import CreatePlanPage from '@src/pages/CreatePlanPage/CreatePlanPage';
import styles from './App.module.scss';

// const CreatePlanPage = withSuspense(React.lazy(() => import('@src/pages/CreatePlanPage/CreatePlanPage')));
const PlansPage = withSuspense(React.lazy(() => import('@src/pages/PlansPage/PlansPage')));
const EditDebtPage = withSuspense(React.lazy(() => import('@src/pages/EditDebtPage/EditDebtPage')));
const CreateDebtPage = withSuspense(React.lazy(() => import('@src/pages/CreateDebtPage/CreateDebtPage')));
const DebtsPage = withSuspense(React.lazy(() => import('@src/pages/DebtsPage/DebtsPage')));
// const CurrentNeighborhoodPage = withSuspense(React.lazy(() => import('@src/pages/CurrentNeighborhoodPage/CurrentNeighborhoodPage')));
const CreateNeighborhoodPage = withSuspense(React.lazy(() => import('@src/pages/CreateNeighborhoodPage/CreateNeighborhoodPage')));
const NeighborhoodsPage = withSuspense(React.lazy(() => import('@src/pages/NeighborhoodsPage/NeighborhoodsPage')));
// const ChatsPage = withSuspense(React.lazy(() => import('@src/pages/ChatsPage/ChatsPage')));
const EditPlanPage = withSuspense(React.lazy(() => import('@src/pages/EditPlanPage/EditPlanPage')));

export const App: React.FC = () => {
  const isLoading = useAppSelector(selectAppLoading);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(appFirstLoad());
  }, []);
  
  return (
    <div className={styles.App}>
      
      {isLoading ? <Loader/> : (
        <Routes>
          <Route path='/' element={<RequireAuth/>}>
            <Route path='/' element={<NeighborhoodsPage/>}/>
            <Route path='/neighborhoods' element={<NeighborhoodsPage/>}/>
            <Route path='/neighborhoods/create' element={<CreateNeighborhoodPage/>}/>
            
            {/*<Route path='/neighborhood' element={<NeighborhoodLayout/>} >*/}
            {/*  <Route path='' element={<CurrentNeighborhoodPage/>} />*/}
            {/*</Route>*/}
            
            <Route path='/debts' element={<DebtsPage/>} />
            <Route path='/debts/create' element={<CreateDebtPage/>} />
            <Route path='/debts/edit/:debtId' element={<EditDebtPage/>} />
            
            <Route path='/plans' element={<PlansPage/>} />
            <Route path='/plans/create' element={<CreatePlanPage/>} />
            <Route path='/plans/edit/:planId' element={<EditPlanPage/>} />
            
            {/*<Route path='/chats' element={<ChatsPage/>}/>*/}
          </Route>
          <Route path='/' element={<AuthLayout/>}>
            <Route path='/register' element={<RegisterPage/>}/>
            <Route path='/login' element={<LoginPage/>}/>
          </Route>
        </Routes>
      )}
      
    </div>
  );
};
