import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPrivate } from '@src/api/api';
import { NEIGHBORHOOD_ROUTES } from '@constants/routes';
import { errorManager } from '@helpers/errors.helper';
import { ErrorEnum } from '@src/types/default.types';
import { ICurrentNeighborhood } from '@src/types/neighborhood.types';
import { normalize } from 'normalizr';
import { neighborhoodSchema } from '@src/store/userNeighborhoods/schema';
import { RootState } from '@src/store';
import { ERRORS } from '@constants/errors';

const MODULE_NAME = 'currentNeighborhood';

export const getCurrentNeighborhood = createAsyncThunk(
  `${MODULE_NAME}/getCurrent`,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.get<ICurrentNeighborhood>(`${NEIGHBORHOOD_ROUTES.getCurrent}?neighborhood_id=${id}`);
      
      const result = normalize(response.data, neighborhoodSchema);
      
      return {
        members: result.entities.members,
        neighborhood: result.entities.neighborhoods[result.result],
      };
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.neighborhood);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const deleteUserFromNeighborhood = createAsyncThunk(
  `${MODULE_NAME}/removeUser`,
  async (userId: string, { rejectWithValue, getState }) => {
    const neighborhoodId: string = (getState() as RootState).currentNeighborhood.neighborhood._id;
    
    if (neighborhoodId) {
      try {
        const response = await axiosPrivate.put<Record<'user_id', string>>(`${NEIGHBORHOOD_ROUTES.removeUser}?user_id=${userId}&neighborhood_id=${neighborhoodId}`);

        return {
          userId: response.data.user_id,
          neighborhoodId,
        };
      } catch (e: any) {
        errorManager(e?.response?.data?.message, ErrorEnum.neighborhood);
        return rejectWithValue(e?.response?.data?.message);
      }
    }
    return rejectWithValue(ERRORS.INVALID_DATA);
  },
);

export const generateInviteCode = createAsyncThunk(
  `${MODULE_NAME}/generateInviteCode`,
  async (_, { rejectWithValue, getState }) => {
    const neighborhoodId: string = (getState() as RootState).currentNeighborhood.neighborhood._id;
    
    if (neighborhoodId) {
      try {
        const response = await axiosPrivate.post<Record<string, string>>(`${NEIGHBORHOOD_ROUTES.generateInviteCode}?neighborhood_id=${neighborhoodId}`);
        return response.data;
      } catch (e: any) {
        errorManager(e?.response?.data?.message, ErrorEnum.neighborhood);
        return rejectWithValue(e?.response?.data?.message);
      }
    }
    return rejectWithValue(ERRORS.INVALID_DATA);
  },
);

export const removeInviteCode = createAsyncThunk(
  `${MODULE_NAME}/removeInviteCode`,
  async (_, { rejectWithValue, getState }) => {
    const neighborhoodId: string = (getState() as RootState).currentNeighborhood.neighborhood._id;
    
    if (neighborhoodId) {
      try {
        const response = await axiosPrivate.delete<Record<string, string>>(`${NEIGHBORHOOD_ROUTES.removeInviteCode}?neighborhood_id=${neighborhoodId}`);
        
        return response.data;
      } catch (e: any) {
        errorManager(e?.response?.data?.message, ErrorEnum.neighborhood);
        return rejectWithValue(e?.response?.data?.message);
      }
    }
    return rejectWithValue(ERRORS.INVALID_DATA);
  },
);