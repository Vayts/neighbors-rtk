import { createAsyncThunk, EntityId } from '@reduxjs/toolkit';
import { axiosPrivate } from '@src/api/api';
import { DUTIES_ROUTES } from '@constants/routes';
import { normalize } from 'normalizr';
import { ICreateDutyDto, IDuty, IEditDutyDto } from '@src/types/duty.types';
import { dutySchema } from '@src/store/duties/schema';

const MODULE_NAME = 'duties';

export const createDuty = createAsyncThunk(
  `${MODULE_NAME}/create`,
  async (values: ICreateDutyDto, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.post(`${DUTIES_ROUTES.create}?neighborhood_id=${values.neighborhood_id}`, values);
      const data = normalize(response.data, dutySchema);

      return data.entities;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const editDuty = createAsyncThunk(
  `${MODULE_NAME}/edit`,
  async ({ id, values }: {id: string, values: IEditDutyDto}, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.put(`${DUTIES_ROUTES.edit}?duty_id=${id}`, values);
      const data = normalize(response.data, dutySchema);
      
      return data.entities;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const getUserDuties = createAsyncThunk(
  `${MODULE_NAME}/getAll`,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.get(id ? `${DUTIES_ROUTES.getById}?neighborhood_id=${id}` : DUTIES_ROUTES.get);
      const data = normalize(response.data, [dutySchema]);
      return data.entities;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const addDutyMark = createAsyncThunk(
  `${MODULE_NAME}/addMark`,
  async ({ duty_id, neighborhood_id, date }: {duty_id: string, neighborhood_id: string, date: string}, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.post(`${DUTIES_ROUTES.addMark}?neighborhood_id=${neighborhood_id}&duty_id=${duty_id}`, { date });
      
      return response.data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const deleteDuty = createAsyncThunk(
  `${MODULE_NAME}/deleteDuty`,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.delete(`${DUTIES_ROUTES.delete}?duty_id=${id}`);
      
      return response.data._id;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const deleteDutyMark = createAsyncThunk(
  `${MODULE_NAME}/deleteMark`,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.delete(`${DUTIES_ROUTES.deleteMark}?mark_id=${id}`);
      
      return {
        duty_id: response.data.duty_id as EntityId,
        mark_id: response.data._id as string,
      };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const addParticipantToDuty = createAsyncThunk(
  `${MODULE_NAME}/addParticipant`,
  async ({ participantId, dutyId }: {dutyId: string, participantId: string}, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.put<IDuty>(`${DUTIES_ROUTES.addParticipant}?duty_id=${dutyId}&participant_id=${participantId}`);
      
      const data = normalize(response.data, dutySchema);
      console.log(data);
      return data.entities.duties[data.result] as IDuty;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const removeParticipantFromDuty = createAsyncThunk(
  `${MODULE_NAME}/removeParticipant`,
  async ({ participantId, dutyId }: {dutyId: string, participantId: string}, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.put<IDuty>(`${DUTIES_ROUTES.removeParticipant}?duty_id=${dutyId}&participant_id=${participantId}`);
      
      const data = normalize(response.data, dutySchema);
      
      return data.entities.duties[data.result] as IDuty;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);
