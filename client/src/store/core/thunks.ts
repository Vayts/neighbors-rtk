import { createAsyncThunk } from '@reduxjs/toolkit';
import { errorManager } from '@helpers/errors.helper';
import { ErrorEnum } from '@src/types/default.types';
import { refresh } from '@src/store/auth/thunks';

const MODULE_NAME = 'core';

export const appFirstLoad = createAsyncThunk(
  `${MODULE_NAME}/firstLoad`,
  async (_, { dispatch }) => {
    try {
      await dispatch(refresh());
      return true;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.app);
    }
  },
);
