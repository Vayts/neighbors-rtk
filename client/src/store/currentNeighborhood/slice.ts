import { ICurrentNeighborhoodState } from '@src/store/currentNeighborhood/types';
import { createSlice } from '@reduxjs/toolkit';
import { getCurrentNeighborhood } from '@src/store/currentNeighborhood/thunks';

const initialState: ICurrentNeighborhoodState = {
  isLoading: true,
  neighborhood: null,
};

export const currentNeighborhoodSlice = createSlice({
  name: 'currentNeighborhood',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentNeighborhood.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentNeighborhood.rejected, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(getCurrentNeighborhood.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.neighborhood = payload.neighborhood;
      });
  },
});
