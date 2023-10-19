import { ICurrentNeighborhoodState } from '@src/store/currentNeighborhood/types';
import { createSlice } from '@reduxjs/toolkit';
import {
  deleteUserFromNeighborhood,
  generateInviteCode,
  getCurrentNeighborhood,
  removeInviteCode,
} from '@src/store/currentNeighborhood/thunks';

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
      .addCase(getCurrentNeighborhood.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getCurrentNeighborhood.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.neighborhood = payload.neighborhood;
      })
      .addCase(deleteUserFromNeighborhood.fulfilled, (state, { payload }) => {
        state.neighborhood.members = state.neighborhood.members.filter((item) => item !== payload.userId);
      })
      .addCase(generateInviteCode.fulfilled, (state, { payload }) => {
        if (payload.neighborhood_id === state.neighborhood._id) {
          state.neighborhood.inviteCode = payload.code;
        }
      })
      .addCase(removeInviteCode.fulfilled, (state, { payload }) => {
        if (payload.neighborhood_id === state.neighborhood._id) {
          state.neighborhood.inviteCode = null;
        }
      });
  },
});
