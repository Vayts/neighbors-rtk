import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { createDebt, getUserDebts } from '@src/store/debts/thunks';
import { INeighborhood } from '@src/types/neighborhood.types';
import { editNeighborhood } from '@src/store/userNeighborhoods/thunks';
import { deleteNeighborhood } from '@src/store/currentNeighborhood/thunks';

export const neighborhoodsAdapter = createEntityAdapter<INeighborhood>({ selectId: (entity) => entity?._id });

export const neighborhoodsSlice = createSlice({
  name: 'neighborhoods',
  initialState: neighborhoodsAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserDebts.fulfilled, (state, { payload }) => {
        neighborhoodsAdapter.upsertMany(state, payload.neighborhoods ?? {});
      })
      .addCase(createDebt.fulfilled, (state, { payload }) => {
        const neighborhoods = payload.neighborhoods ?? {};
        
        Object.keys(neighborhoods).forEach((key) => {
          if (state.ids.includes(key)) {
            delete neighborhoods[key];
          }
        });
        
        if (Object.keys(neighborhoods)) {
          neighborhoodsAdapter.upsertMany(state, neighborhoods);
        }
      })
      .addCase(editNeighborhood.fulfilled, (state, { payload }) => {
        neighborhoodsAdapter.updateOne(state, { id: payload._id,
          changes: {
            ...payload,
          } });
      })
      .addCase(deleteNeighborhood.fulfilled, (state, { payload }) => {
        neighborhoodsAdapter.removeOne(state, payload);
      });
  },
});
