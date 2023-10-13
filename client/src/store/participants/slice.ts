import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { createPlan, getUserPlans } from '@src/store/plans/thunks';
import { IMember } from '@src/types/user.types';

export const participantsAdapter = createEntityAdapter<IMember>({ selectId: (entity) => entity?._id });

export const participantsSlice = createSlice({
  name: 'participants',
  initialState: participantsAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserPlans.fulfilled, (state, { payload }) => {
        participantsAdapter.setAll(state, payload.participants ?? {});
      })
      .addCase(createPlan.fulfilled, (state, { payload }) => {
        participantsAdapter.upsertMany(state, payload?.participants ?? {});
      });
  },
});
