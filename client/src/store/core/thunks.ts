import { createAsyncThunk } from '@reduxjs/toolkit';
import { refresh } from '@src/store/auth/thunks';
import { LocaleEnum } from '@src/types/locale.types';
import { setLanguage } from '@src/store/core/slice';
import { getUserNeighborhoods } from '@src/store/userNeighborhoods/thunks';
import { RootState } from '@src/store';

const MODULE_NAME = 'core';

export const appFirstLoad = createAsyncThunk(
  `${MODULE_NAME}/firstLoad`,
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      await dispatch(refresh());
      
      const user = (getState() as RootState).auth.user;
      
      if (user) {
        await dispatch(getUserNeighborhoods());
      }
      
      const locale = window.localStorage.getItem('neighbors_lang');
      
      if (locale === LocaleEnum.en || locale === LocaleEnum.uk) {
        dispatch(setLanguage(locale));
      }
      return true;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);
