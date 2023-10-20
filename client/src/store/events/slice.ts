import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { INeighborhoodEvent } from '@src/types/event.types';
import { getCurrentNeighborhood } from '@src/store/currentNeighborhood/thunks';

export const eventsAdapter = createEntityAdapter<INeighborhoodEvent>({ selectId: (entity) => entity?._id });

export const eventsSlice = createSlice({
  name: 'events',
  initialState: eventsAdapter.getInitialState(),
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentNeighborhood.fulfilled, (state, { payload }) => {
        eventsAdapter.setAll(state, payload?.events ?? {});
      });
  },
});
