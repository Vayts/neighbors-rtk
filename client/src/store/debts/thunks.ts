import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPrivate } from '@src/api/api';
import { DEBTS_ROUTES } from '@constants/routes';
import { normalize } from 'normalizr';
import { errorManager } from '@helpers/errors.helper';
import { ErrorEnum } from '@src/types/default.types';
import { debtSchema } from '@src/store/debts/schema';
import { ICreateDebtDto, IDebt, IEditDebtDto } from '@src/types/debt.types';

const MODULE_NAME = 'debts';

export const getUserDebts = createAsyncThunk(
  `${MODULE_NAME}/getDebts`,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.get(id ? `${DEBTS_ROUTES.getById}?neighborhood_id=${id}` : DEBTS_ROUTES.get);
      const data = normalize(response.data, [debtSchema]);
      return data.entities;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.debt);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const createDebt = createAsyncThunk(
  `${MODULE_NAME}/create`,
  async (values: ICreateDebtDto, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.post(`${DEBTS_ROUTES.create}?neighborhood_id=${values.neighborhood_id}&debtor_id=${values.debtor_id}`, values);
      const data = normalize(response.data, [debtSchema]);

      return data.entities;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.debt);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const deleteDebt = createAsyncThunk(
  `${MODULE_NAME}/delete`,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.delete(`${DEBTS_ROUTES.delete}?debt_id=${id}`);

      return response.data;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.debt);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const addDebtPayment = createAsyncThunk(
  `${MODULE_NAME}/addPayment`,
  async ({ id, amount }: { id: string, amount: string }, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.put(`${DEBTS_ROUTES.addPayment}?debt_id=${id}`, { amount });
      return response.data;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.debt);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const closeDebt = createAsyncThunk(
  `${MODULE_NAME}/closeDebt`,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.put(`${DEBTS_ROUTES.closeDebt}?debt_id=${id}`);
      
      return response.data;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.debt);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const editDebt = createAsyncThunk(
  `${MODULE_NAME}/editDebt`,
  async ({ id, values }: {id: string, values: IEditDebtDto}, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.put(`${DEBTS_ROUTES.edit}?debt_id=${id}`, values);
      
      return response.data as IDebt;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.debt);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);
