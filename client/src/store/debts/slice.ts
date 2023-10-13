import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDebtsState } from '@src/store/debts/types';
import { IDebt } from '@src/types/debt.types';
import { addDebtPayment, closeDebt, createDebt, deleteDebt, editDebt, getUserDebts } from '@src/store/debts/thunks';

const initialState: IDebtsState = {
  isLoading: true,
  loadingItems: [],
};

export const debtsAdapter = createEntityAdapter<IDebt>({ selectId: (entity) => entity?._id });

export const debtsSlice = createSlice({
  name: 'debts',
  initialState: debtsAdapter.getInitialState(initialState),
  reducers: {
    setLoadingDebts: (state, action: PayloadAction<string>) => {
      if (state.loadingItems.includes(action.payload)) {
        state.loadingItems = state.loadingItems.filter((item) => item !== action.payload);
      } else {
        state.loadingItems.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserDebts.fulfilled, (state, { payload }) => {
        debtsAdapter.setAll(state, payload.debts ?? {});
        state.isLoading = false;
      })
      .addCase(createDebt.fulfilled, (state, { payload }) => {
        debtsAdapter.upsertMany(state, payload.debts ?? {});
      })
      .addCase(deleteDebt.fulfilled, (state, { payload }) => {
        debtsAdapter.removeOne(state, payload._id);
      })
      .addCase(addDebtPayment.fulfilled, (state, { payload }) => {
        debtsAdapter.updateOne(state, {
          id: payload._id,
          changes: {
            repaidAmount: payload.repaidAmount,
          },
        });
      })
      .addCase(closeDebt.fulfilled, (state, { payload }) => {
        debtsAdapter.updateOne(state, {
          id: payload._id,
          changes: {
            repaidAmount: payload.repaidAmount,
          },
        });
      })
      .addCase(editDebt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editDebt.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(editDebt.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        debtsAdapter.updateOne(state, {
          id: payload._id,
          changes: {
            ...payload,
          },
        });
      });
  },
});

export const { setLoadingDebts } = debtsSlice.actions;
