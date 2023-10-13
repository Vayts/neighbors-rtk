import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from '@src/store/auth/slice';
import { coreSlice } from '@src/store/core/slice';
import { userNeighborhoodsSlice } from '@src/store/userNeighborhoods/slice';
import { debtsSlice } from '@src/store/debts/slice';
import { debtorsSlice } from '@src/store/debtors/slice';
import { membersSlice } from '@src/store/members/slice';
import { participantsSlice } from '@src/store/participants/slice';
import { plansSlice } from '@src/store/plans/slice';
import { neighborhoodsSlice } from '@src/store/neighborhoodDebts/slice';

export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [coreSlice.name]: coreSlice.reducer,
    [userNeighborhoodsSlice.name]: userNeighborhoodsSlice.reducer,
    [debtsSlice.name]: debtsSlice.reducer,
    [debtorsSlice.name]: debtorsSlice.reducer,
    [membersSlice.name]: membersSlice.reducer,
    [participantsSlice.name]: participantsSlice.reducer,
    [plansSlice.name]: plansSlice.reducer,
    [neighborhoodsSlice.name]: neighborhoodsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
