import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IPlansState } from '@src/store/plans/types';
import { IPlan } from '@src/types/plan.types';
import { addPlanPayment, changePlanTaskStatus, closePlan, createPlan, deletePlan, getUserPlans, reopenPlan } from '@src/store/plans/thunks';

const initialState: IPlansState = {
  isLoading: true,
  loadingItems: [],
};

export const plansAdapter = createEntityAdapter<IPlan>({ selectId: (entity) => entity?._id });

export const plansSlice = createSlice({
  name: 'plans',
  initialState: plansAdapter.getInitialState(initialState),
  reducers: {
    setLoadingPlans: (state, { payload }) => {
      if (state.loadingItems.includes(payload)) {
        state.loadingItems = state.loadingItems.filter((item) => item !== payload);
      } else {
        state.loadingItems.push(payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserPlans.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserPlans.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(closePlan.fulfilled, (state, { payload }) => {
        plansAdapter.updateOne(state, { id: payload._id,
          changes: {
            isClosed: true,
          } });
      })
      .addCase(createPlan.fulfilled, (state, { payload }) => {
        plansAdapter.upsertMany(state, payload?.debts ?? {});
      })
      .addCase(reopenPlan.fulfilled, (state, { payload }) => {
        plansAdapter.updateOne(state, { id: payload._id,
          changes: {
            isClosed: false,
          } });
      })
      .addCase(addPlanPayment.fulfilled, (state, { payload }) => {
        plansAdapter.updateOne(state, { id: payload._id,
          changes: {
            currentPayment: payload.currentPayment,
            participantPayments: payload.participantPayments,
          } });
      })
      .addCase(changePlanTaskStatus.fulfilled, (state, { payload }) => {
        plansAdapter.updateOne(state, { id: payload._id,
          changes: {
            tasksList: payload.tasksList,
          } });
      })
      .addCase(getUserPlans.fulfilled, (state, { payload }) => {
        plansAdapter.setAll(state, payload.plans ?? {});
        state.isLoading = false;
      })
      .addCase(deletePlan.fulfilled, (state, { payload }) => {
        plansAdapter.removeOne(state, payload._id);
      });
  },
});

export const { setLoadingPlans } = plansSlice.actions;
