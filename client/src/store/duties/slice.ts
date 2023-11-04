import { IDutiesState } from '@src/store/duties/types';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IDuty } from '@src/types/duty.types';
import {
  addDutyMark,
  addParticipantToDuty,
  deleteDuty,
  deleteDutyMark,
  getUserDuties,
  removeParticipantFromDuty,
} from '@src/store/duties/thunks';

const initialState: IDutiesState = {
  isLoading: true,
  loadingItems: [],
};

export const dutiesAdapter = createEntityAdapter<IDuty>({ selectId: (entity) => entity?._id });

export const dutiesSlice = createSlice({
  name: 'duties',
  initialState: dutiesAdapter.getInitialState(initialState),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserDuties.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserDuties.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(addDutyMark.fulfilled, (state, { payload }) => {
        const duty = state.entities[payload.duty_id];
        dutiesAdapter.updateOne(state, { id: duty._id,
          changes: {
            dutyMarks: [...duty.dutyMarks, payload],
          } });
      })
      .addCase(deleteDutyMark.fulfilled, (state, { payload }) => {
        const duty = state.entities[payload.duty_id];
        dutiesAdapter.updateOne(state,
          {
            id: duty._id,
            changes: {
              dutyMarks: duty.dutyMarks.filter((item) => item._id !== payload.mark_id),
            },
          });
      })
      .addCase(deleteDuty.fulfilled, (state, { payload }) => {
        dutiesAdapter.removeOne(state, payload);
      })
      .addCase(addParticipantToDuty.fulfilled, (state, { payload }) => {
        dutiesAdapter.upsertOne(state, payload);
      })
      .addCase(removeParticipantFromDuty.fulfilled, (state, { payload }) => {
        dutiesAdapter.upsertOne(state, payload);
      })
      .addCase(getUserDuties.fulfilled, (state, { payload }) => {
        dutiesAdapter.setAll(state, payload.duties ?? {});
        state.isLoading = false;
      });
  },
});
