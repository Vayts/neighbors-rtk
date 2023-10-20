import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { INeighborhood } from '@src/types/neighborhood.types';
import {
  createNeighborhood, editNeighborhood,
  getNeighborhoodByCode,
  getUserNeighborhoods,
  joinNeighborhoodByCode, removeNeighborhoodFavorite,
  setNeighborhoodFavorite,
} from '@src/store/userNeighborhoods/thunks';
import { INeighborhoodsState } from '@src/store/userNeighborhoods/types';
import { logout } from '@src/store/auth/thunks';
import { deleteNeighborhood, leaveFromNeighborhood } from '@src/store/currentNeighborhood/thunks';

const initialState: INeighborhoodsState = {
  isLoading: true,
  neighborhoodByCode: null,
};

export const userNeighborhoodsAdapter = createEntityAdapter<INeighborhood>({ selectId: (entity) => entity?._id });

export const userNeighborhoodsSlice = createSlice({
  name: 'userNeighborhoods',
  initialState: userNeighborhoodsAdapter.getInitialState(initialState),
  reducers: {
    resetNeighborhoodByCode: (state) => {
      state.neighborhoodByCode = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserNeighborhoods.fulfilled, (state, { payload }) => {
        userNeighborhoodsAdapter.setAll(state, payload?.neighborhoods ?? {});
        state.isLoading = false;
      })
      .addCase(getNeighborhoodByCode.fulfilled, (state, { payload }) => {
        state.neighborhoodByCode = payload;
      })
      .addCase(joinNeighborhoodByCode.fulfilled, (state, { payload }) => {
        userNeighborhoodsAdapter.upsertMany(state, payload.neighborhoods);
      })
      .addCase(createNeighborhood.fulfilled, (state, { payload }) => {
        userNeighborhoodsAdapter.upsertMany(state, payload.neighborhoods);
      })
      .addCase(setNeighborhoodFavorite.fulfilled, (state, { payload }) => {
        userNeighborhoodsAdapter.updateOne(state, { id: payload,
          changes: {
            isFavorite: true,
          } });
      })
      .addCase(removeNeighborhoodFavorite.fulfilled, (state, { payload }) => {
        userNeighborhoodsAdapter.updateOne(state, { id: payload,
          changes: {
            isFavorite: false,
          } });
      })
      .addCase(logout.fulfilled, (state) => {
        userNeighborhoodsAdapter.removeAll(state);
        state.isLoading = true;
      })
      .addCase(editNeighborhood.fulfilled, (state, { payload }) => {
        userNeighborhoodsAdapter.updateOne(state, { id: payload._id,
          changes: {
            ...payload,
          } });
      })
      .addCase(leaveFromNeighborhood.fulfilled, (state, { payload }) => {
        userNeighborhoodsAdapter.removeOne(state, payload);
      })
      .addCase(deleteNeighborhood.fulfilled, (state, { payload }) => {
        userNeighborhoodsAdapter.removeOne(state, payload);
      });
  },
});

export const { resetNeighborhoodByCode } = userNeighborhoodsSlice.actions;
