import { ICurrentNeighborhoodState } from '@src/store/currentNeighborhood/types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: ICurrentNeighborhoodState = {
  isLoading: false,
  neighborhood: null,
};

export const currentNeighborhoodSlice = createSlice({
  name: 'currentNeighborhood',
  initialState,
  reducers: {},
});
