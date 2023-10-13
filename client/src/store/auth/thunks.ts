import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPrivate, axiosPublic } from '@src/api/api';
import { ILogin, IRegister } from '@src/types/auth.types';
import { AUTH_ROUTES } from '@constants/routes';
import { errorManager } from '@helpers/errors.helper';
import { ErrorEnum } from '@src/types/default.types';

const MODULE_NAME = 'auth';

export const login = createAsyncThunk(
  `${MODULE_NAME}/login`,
  async (values: ILogin) => {
    try {
      const response = await axiosPublic.post(AUTH_ROUTES.login, values);
      return response.data;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.auth);
    }
  },
);

export const refresh = createAsyncThunk(
  `${MODULE_NAME}/refresh`,
  async () => {
    try {
      const response = await axiosPublic.get(AUTH_ROUTES.refresh);
      return response.data;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.auth);
    }
  },
);

export const logout = createAsyncThunk(
  `${MODULE_NAME}/logout`,
  async () => {
    try {
      const response = await axiosPrivate.get(AUTH_ROUTES.logout);
      return response.data;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.auth);
    }
  },
);

export const register = createAsyncThunk(
  `${MODULE_NAME}/register`,
  async (values: IRegister) => {
    try {
      const response = await axiosPrivate.post(AUTH_ROUTES.register, values);
      return response.data;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.auth);
    }
  },
);
