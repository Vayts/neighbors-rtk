import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { createDebt, getUserDebts } from '@src/store/debts/thunks';
import { userNeighborhoodsAdapter } from '@src/store/userNeighborhoods/slice';
import { INeighborhood } from '@src/types/neighborhood.types';

export const neighborhoodsAdapter = createEntityAdapter<INeighborhood>({ selectId: (entity) => entity?._id });

export const neighborhoodsSlice = createSlice({
  name: 'neighborhoods',
  initialState: neighborhoodsAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserDebts.fulfilled, (state, { payload }) => {
        userNeighborhoodsAdapter.upsertMany(state, payload.neighborhoods ?? {});
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
      });
  },
});
