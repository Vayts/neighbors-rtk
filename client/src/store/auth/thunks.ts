import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPrivate, axiosPublic } from '@src/api/api';
import { IEditProfile, ILogin, IRegister } from '@src/types/auth.types';
import { AUTH_ROUTES, USER_ROUTES } from '@constants/routes';
import { errorManager } from '@helpers/errors.helper';
import { ErrorEnum } from '@src/types/default.types';
import { getNotification } from '@helpers/notification.helper';
import { NotificationTypeEnum } from '@src/types/notification.types';
import i18n from 'i18next';

const t = i18n.t;

const MODULE_NAME = 'auth';

export const login = createAsyncThunk(
  `${MODULE_NAME}/login`,
  async (values: ILogin, { rejectWithValue }) => {
    try {
      const response = await axiosPublic.post(AUTH_ROUTES.login, values);
      return response.data;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.auth);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const refresh = createAsyncThunk(
  `${MODULE_NAME}/refresh`,
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosPublic.get(AUTH_ROUTES.refresh);
      return response.data;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.auth);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const logout = createAsyncThunk(
  `${MODULE_NAME}/logout`,
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.get(AUTH_ROUTES.logout);
      return response.data;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.auth);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const register = createAsyncThunk(
  `${MODULE_NAME}/register`,
  async (values: IRegister, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.post(AUTH_ROUTES.register, values);
      return response.data;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.auth);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const editProfile = createAsyncThunk(
  `${MODULE_NAME}/editProfile`,
  async (values: IEditProfile, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.put(USER_ROUTES.editProfile, { ...values });
      
      getNotification(t('dataUpdatedSuccess'), NotificationTypeEnum.success);
      return response.data;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.auth);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);
