import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IChatRoom } from '@src/types/chat.types';
import { loadMoreMessages } from '@src/store/messages/thunks';

export const chatsAdapter = createEntityAdapter<IChatRoom>({ selectId: (entity) => entity?._id });

export const chatsSlice = createSlice({
  name: 'chats',
  initialState: chatsAdapter.getInitialState(),
  reducers: {
    setChats: (state, { payload }) => {
      chatsAdapter.setAll(state, payload.chats ?? {});
    },
    updateMessages: (state, { payload }) => {
      const updatedMessages = [...state.entities[payload.chat_id].messages, payload._id];
      
      chatsAdapter.updateOne(state, { id: payload.chat_id,
        changes: {
          messages: updatedMessages,
        } });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMoreMessages.fulfilled, (state, { payload }) => {
        const updatedMessages = [...payload.ids, ...state.entities[payload.chat_id].messages];
        
        chatsAdapter.updateOne(state, { id: payload.chat_id,
          changes: {
            messages: updatedMessages,
            hasMoreMessages: payload.hasMoreMessages,
          } });
      });
  },
});

export const { setChats, updateMessages } = chatsSlice.actions;
