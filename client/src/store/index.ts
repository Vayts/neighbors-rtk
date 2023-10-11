import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from '@src/store/auth/slice';
import { coreSlice } from '@src/store/core/slice';
import { neighborhoodsSlice } from '@src/store/neighborhoods/slice';

export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [coreSlice.name]: coreSlice.reducer,
    [neighborhoodsSlice.name]: neighborhoodsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
