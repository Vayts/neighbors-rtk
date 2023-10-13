import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IMember } from '@src/types/user.types';
import { getUserNeighborhoods } from '@src/store/userNeighborhoods/thunks';

export const membersAdapter = createEntityAdapter<IMember>({ selectId: (entity) => entity?._id });

export const membersSlice = createSlice({
  name: 'members',
  initialState: membersAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserNeighborhoods.fulfilled, (state, { payload }) => {
        membersAdapter.setAll(state, payload?.members ?? {});
      });
  },
});
