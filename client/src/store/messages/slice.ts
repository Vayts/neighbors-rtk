import { createEntityAdapter, createSlice, EntityId } from '@reduxjs/toolkit';
import { IMessage } from '@src/types/chat.types';
import { IMessageState } from '@src/store/messages/types';
import { loadMoreMessages } from '@src/store/messages/thunks';

export const messagesAdapter = createEntityAdapter<IMessage>({ selectId: (entity) => entity?._id });

const initialState: IMessageState = {
  viewedMessages: [],
  isLoading: false,
};

export const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState(initialState),
  reducers: {
    setMessages: (state, { payload }) => {
      messagesAdapter.setAll(state, payload.messages ?? {});
    },
    addMessage: (state, { payload }) => {
      const { message, idsToUpdate } = payload;
      messagesAdapter.upsertOne(state, message ?? {});
      
      if (idsToUpdate.length) {
        state.viewedMessages = state.viewedMessages.filter((item) => !idsToUpdate.includes(item));
        
        idsToUpdate.forEach((item: EntityId) => {
          const seenBy = state.entities[item]?.seenBy;
          
          if (seenBy) {
            messagesAdapter.updateOne(state, { id: item, changes: { seenBy: [...seenBy, payload.userId] } });
          }
        });
      }
    },
    addViewedMessage: (state, { payload }) => {
      state.viewedMessages.push(payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMoreMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadMoreMessages.fulfilled, (state, { payload }) => {
        messagesAdapter.upsertMany(state, payload.entities.messages ?? {});
        state.isLoading = false;
      });
  },
});

export const { setMessages, addViewedMessage, addMessage } = messagesSlice.actions;
