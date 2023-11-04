import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPrivate } from '@src/api/api';
import { PLAN_ROUTES } from '@constants/routes';
import { normalize } from 'normalizr';
import { errorManager } from '@helpers/errors.helper';
import { ErrorEnum } from '@src/types/default.types';
import { planSchema } from '@src/store/plans/schema';
import { ICreatePlanDto, IEditPlanDto, IPlan } from '@src/types/plan.types';
import { IDuty } from '@src/types/duty.types';

const MODULE_NAME = 'plans';

export const getUserPlans = createAsyncThunk(
  `${MODULE_NAME}/getAll`,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.get(id ? `${PLAN_ROUTES.getById}?neighborhood_id=${id}` : PLAN_ROUTES.get);
      const data = normalize(response.data, [planSchema]);

      return data.entities ?? {};
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.plan);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const createPlan = createAsyncThunk(
  `${MODULE_NAME}/create`,
  async (values: ICreatePlanDto, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.post(`${PLAN_ROUTES.create}?neighborhood_id=${values.neighborhood_id}`, values);
      const data = normalize(response.data, [planSchema]);
      return data.entities ?? {};
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const closePlan = createAsyncThunk(
  `${MODULE_NAME}/close`,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.put(`${PLAN_ROUTES.closePlan}?plan_id=${id}`);
      
      return response.data;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.plan);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const changePlanTaskStatus = createAsyncThunk(
  `${MODULE_NAME}/changeTaskStatus`,
  async ({ planId, taskId }: {planId: string, taskId: string}, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.put(`${PLAN_ROUTES.changeTaskStatus}?plan_id=${planId}&task_id=${taskId}`);
      
      return response.data as IPlan;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.plan);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const addPlanPayment = createAsyncThunk(
  `${MODULE_NAME}/addPayment`,
  async ({ planId, amount }: {planId: string, amount: string}, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.put(`${PLAN_ROUTES.addPayment}?plan_id=${planId}`, { amount });
      
      return response.data as IPlan;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.plan);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const reopenPlan = createAsyncThunk(
  `${MODULE_NAME}/reopen`,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.put(`${PLAN_ROUTES.reopenPlan}?plan_id=${id}`);
      
      return response.data as IPlan;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.plan);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const editPlan = createAsyncThunk(
  `${MODULE_NAME}/edit`,
  async ({ id, values }: {id: string, values: IEditPlanDto}, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.put(`${PLAN_ROUTES.edit}?plan_id=${id}`, values);
      
      return response.data as IPlan;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.plan);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const deletePlan = createAsyncThunk(
  `${MODULE_NAME}/delete`,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.delete(`${PLAN_ROUTES.deletePlan}?plan_id=${id}`);
      
      return response.data as IPlan;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.plan);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const addParticipantToPlan = createAsyncThunk(
  `${MODULE_NAME}/addParticipant`,
  async ({ participantId, planId }: {planId: string, participantId: string}, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.put<IDuty>(`${PLAN_ROUTES.addParticipant}?plan_id=${planId}&participant_id=${participantId}`);
      
      const data = normalize(response.data, planSchema);
      
      return data.entities.plans[data.result];
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const removeParticipantFromPlan = createAsyncThunk(
  `${MODULE_NAME}/removeParticipant`,
  async ({ participantId, planId }: {planId: string, participantId: string}, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.put<IDuty>(`${PLAN_ROUTES.removeParticipant}?plan_id=${planId}&participant_id=${participantId}`);
      
      const data = normalize(response.data, planSchema);
      
      return data.entities.plans[data.result];
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);
