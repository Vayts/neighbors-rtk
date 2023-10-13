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
  `${MODULE_NAME}/getAll`,
  async (id: string) => {
    try {
      const response = await axiosPrivate.get(`${DEBTS_ROUTES.get}?neighborhood_id=${id}`);
      const data = normalize(response.data, [debtSchema]);
      return data.entities;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.debt);
    }
  },
);

export const createDebt = createAsyncThunk(
  `${MODULE_NAME}/create`,
  async (values: ICreateDebtDto) => {
    try {
      const response = await axiosPrivate.post(`${DEBTS_ROUTES.create}?neighborhood_id=${values.neighborhood_id}&debtor_id=${values.debtor_id}`, values);
      const data = normalize(response.data, [debtSchema]);
      return data.entities;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.debt);
    }
  },
);

export const deleteDebt = createAsyncThunk(
  `${MODULE_NAME}/delete`,
  async (id: string) => {
    try {
      const response = await axiosPrivate.delete(`${DEBTS_ROUTES.delete}?debt_id=${id}`);

      return response.data;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.debt);
    }
  },
);

export const addDebtPayment = createAsyncThunk(
  `${MODULE_NAME}/addPayment`,
  async ({ id, amount }: { id: string, amount: string }, { dispatch }) => {
    try {
      const response = await axiosPrivate.put(`${DEBTS_ROUTES.addPayment}?debt_id=${id}`, { amount });
      return response.data;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.debt);
    }
  },
);

export const closeDebt = createAsyncThunk(
  `${MODULE_NAME}/closeDebt`,
  async (id: string) => {
    try {
      const response = await axiosPrivate.put(`${DEBTS_ROUTES.closeDebt}?debt_id=${id}`);
      
      return response.data;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.debt);
    }
  },
);

export const editDebt = createAsyncThunk(
  `${MODULE_NAME}/editDebt`,
  async ({ id, values }: {id: string, values: IEditDebtDto}) => {
    try {
      const response = await axiosPrivate.put(`${DEBTS_ROUTES.edit}?debt_id=${id}`, values);
      
      return response.data as IDebt;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.debt);
    }
  },
);
