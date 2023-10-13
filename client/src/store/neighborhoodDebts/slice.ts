import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { getUserDebts } from '@src/store/debts/thunks';
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
      });
  },
});
