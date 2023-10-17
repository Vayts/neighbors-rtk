import { createAsyncThunk } from '@reduxjs/toolkit';
import { errorManager } from '@helpers/errors.helper';
import { ErrorEnum } from '@src/types/default.types';
import { refresh } from '@src/store/auth/thunks';
import { ILocale } from '@src/types/locale.types';
import { setLanguage } from '@src/store/core/slice';

const MODULE_NAME = 'core';

export const appFirstLoad = createAsyncThunk(
  `${MODULE_NAME}/firstLoad`,
  async (_, { dispatch }) => {
    try {
      await dispatch(refresh());
      
      const locale = window.localStorage.getItem('neighbors_lang');
      
      if (locale === ILocale.en || locale === ILocale.uk) {
        dispatch(setLanguage(locale));
      }
      return true;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.app);
    }
  },
);
