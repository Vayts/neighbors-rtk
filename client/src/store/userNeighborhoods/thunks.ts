import { createAsyncThunk, EntityId } from '@reduxjs/toolkit';
import { axiosPrivate } from '@src/api/api';
import { NEIGHBORHOOD_ROUTES } from '@constants/routes';
import { errorManager } from '@helpers/errors.helper';
import { ErrorEnum } from '@src/types/default.types';
import { normalize } from 'normalizr';
import { neighborhoodSchema } from '@src/store/userNeighborhoods/schema';
import { ICreateNeighborhood } from '@src/types/neighborhood.types';

const MODULE_NAME = 'neighborhoods';

export const getUserNeighborhoods = createAsyncThunk(
  `${MODULE_NAME}/getAll`,
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.get(NEIGHBORHOOD_ROUTES.getUserNeighborhoods);
      const data = normalize(response.data, [neighborhoodSchema]);
      return data.entities ?? {};
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.neighborhood);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const getNeighborhoodByCode = createAsyncThunk(
  `${MODULE_NAME}/getByCode`,
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.get(`${NEIGHBORHOOD_ROUTES.getByCode}?code=${code}`);
      return response.data.neighborhood;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.neighborhood);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const joinNeighborhoodByCode = createAsyncThunk(
  `${MODULE_NAME}/joinByCode`,
  async ({ id, code }: {id: string, code: string}, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.get(`${NEIGHBORHOOD_ROUTES.joinByCode}?code=${code}&id=${id}`);
      const data = normalize(response.data, [neighborhoodSchema]);

      return data.entities;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.neighborhood);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const setNeighborhoodFavorite = createAsyncThunk(
  `${MODULE_NAME}/setFavorite`,
  async (id: EntityId, { rejectWithValue }) => {
    try {
      await axiosPrivate.put(`${NEIGHBORHOOD_ROUTES.setFavorite}?neighborhood_id=${id}`);
      return id as EntityId;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.neighborhood);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const removeNeighborhoodFavorite = createAsyncThunk(
  `${MODULE_NAME}/removeFavorite`,
  async (id: EntityId, { rejectWithValue }) => {
    try {
      await axiosPrivate.put(`${NEIGHBORHOOD_ROUTES.removeFavorite}?neighborhood_id=${id}`);
      return id as EntityId;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.neighborhood);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const createNeighborhood = createAsyncThunk(
  `${MODULE_NAME}/create`,
  async (values: ICreateNeighborhood, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.post(`${NEIGHBORHOOD_ROUTES.create}`, values);
      const data = normalize(response.data, [neighborhoodSchema]);
      return data.entities;
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.neighborhood);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);
