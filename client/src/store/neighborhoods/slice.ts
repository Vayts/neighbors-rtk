import { createEntityAdapter, createSlice, EntityId } from '@reduxjs/toolkit';
import { INeighborhood } from '@src/types/neighborhood.types';
import {
  getNeighborhoodByCode,
  getUserNeighborhoods,
  joinNeighborhoodByCode, removeNeighborhoodFavorite,
  setNeighborhoodFavorite,
} from '@src/store/neighborhoods/thunks';
import { INeighborhoodsState } from '@src/store/neighborhoods/types';

const initialState: INeighborhoodsState = {
  isLoading: true,
  neighborhoodByCode: null,
};

export const neighborhoodsAdapter = createEntityAdapter<INeighborhood>({ selectId: (entity) => entity?._id });

export const neighborhoodsSlice = createSlice({
  name: 'neighborhoods',
  initialState: neighborhoodsAdapter.getInitialState(initialState),
  reducers: {
    resetNeighborhoodByCode: (state) => {
      state.neighborhoodByCode = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserNeighborhoods.fulfilled, (state, { payload }) => {
        neighborhoodsAdapter.setAll(state, payload.neighborhoods as Record<EntityId, INeighborhood>);
        state.isLoading = false;
      })
      .addCase(getNeighborhoodByCode.fulfilled, (state, { payload }) => {
        state.neighborhoodByCode = payload;
      })
      .addCase(joinNeighborhoodByCode.fulfilled, (state, { payload }) => {
        neighborhoodsAdapter.upsertMany(state, payload.neighborhoods);
      })
      .addCase(setNeighborhoodFavorite.fulfilled, (state, { payload }) => {
        neighborhoodsAdapter.updateOne(state, { id: payload,
          changes: {
            isFavorite: true,
          } });
      })
      .addCase(removeNeighborhoodFavorite.fulfilled, (state, { payload }) => {
        neighborhoodsAdapter.updateOne(state, { id: payload,
          changes: {
            isFavorite: false,
          } });
      });
  },
});

export const { resetNeighborhoodByCode } = neighborhoodsSlice.actions;
