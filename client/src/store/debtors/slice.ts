import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IDebtsState } from '@src/store/debts/types';
import { getUserDebts } from '@src/store/debts/thunks';
import { IUser } from '@src/types/user.types';

const initialState: IDebtsState = {
  isLoading: true,
  loadingItems: [],
};

export const debtorsAdapter = createEntityAdapter<IUser>({ selectId: (entity) => entity?._id });

export const debtorsSlice = createSlice({
  name: 'debtors',
  initialState: debtorsAdapter.getInitialState(initialState),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserDebts.fulfilled, (state, { payload }) => {
        debtorsAdapter.setAll(state, payload.users ?? {});
      });
  },
});

