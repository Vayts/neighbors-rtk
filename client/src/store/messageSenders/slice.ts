import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IMember } from '@src/types/user.types';
import { loadMoreMessages } from '@src/store/messages/thunks';

export const messageSendersAdapter = createEntityAdapter<IMember>({ selectId: (entity) => entity?._id });

export const messageSendersSlice = createSlice({
  name: 'messageSenders',
  initialState: messageSendersAdapter.getInitialState(),
  reducers: {
    setMessageSenders: (state, { payload }) => {
      messageSendersAdapter.setAll(state, payload.senders ?? {});
    },
    addMessageSender: (state, { payload }) => {
      if (!state.entities.hasOwnProperty(payload._id)) {
        messageSendersAdapter.upsertOne(state, payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMoreMessages.fulfilled, (state, { payload }) => {
        const senders = payload.entities.senders ?? {};
        
        Object.keys(senders).forEach((key) => {
          if (state.ids.includes(key)) {
            delete senders[key];
          }
        });
        
        if (Object.keys(senders)) {
          messageSendersAdapter.upsertMany(state, senders);
        }
      });
  },
});

export const { setMessageSenders, addMessageSender } = messageSendersSlice.actions;
