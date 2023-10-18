import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPrivate } from '@src/api/api';
import { NEIGHBORHOOD_ROUTES } from '@constants/routes';
import { errorManager } from '@helpers/errors.helper';
import { ErrorEnum } from '@src/types/default.types';
import { ICurrentNeighborhood } from '@src/types/neighborhood.types';

const MODULE_NAME = 'currentNeighborhood';

export const getCurrentNeighborhood = createAsyncThunk(
  `${MODULE_NAME}/getCurrent`,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.get<ICurrentNeighborhood>(`${NEIGHBORHOOD_ROUTES.getCurrent}?neighborhood_id=${id}`);
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.neighborhood);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);
