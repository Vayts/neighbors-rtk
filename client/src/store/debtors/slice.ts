import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IDebtsState } from '@src/store/debts/types';
import { createDebt, getUserDebts } from '@src/store/debts/thunks';
import { IMember } from '@src/types/user.types';

const initialState: IDebtsState = {
  isLoading: true,
  loadingItems: [],
};

export const debtorsAdapter = createEntityAdapter<IMember>({ selectId: (entity) => entity?._id });

export const debtorsSlice = createSlice({
  name: 'debtors',
  initialState: debtorsAdapter.getInitialState(initialState),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserDebts.fulfilled, (state, { payload }) => {
        debtorsAdapter.setAll(state, payload?.users ?? {});
      })
      .addCase(createDebt.fulfilled, (state, { payload }) => {
        const debtors = payload.users ?? {};

        Object.keys(debtors).forEach((key) => {
          if (state.ids.includes(key)) {
            delete debtors[key];
          }
        });

        if (Object.keys(debtors)) {
          debtorsAdapter.upsertMany(state, debtors);
        }
      });
  },
});
