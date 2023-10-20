import { ICoreState } from '@src/store/core/types';
import { createSlice } from '@reduxjs/toolkit';
import { appFirstLoad } from '@src/store/core/thunks';

const initialState: ICoreState = {
  locale: 'en',
  isLoading: true,
};

export const coreSlice = createSlice({
  name: 'core',
  initialState,
  reducers: {
    setLanguage: (state, { payload }) => {
      state.locale = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(appFirstLoad.fulfilled, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setLanguage } = coreSlice.actions;
