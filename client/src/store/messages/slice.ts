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
      messagesAdapter.upsertOne(state, payload ?? {});
    },
    updateUnseenMessage: (state, { payload }) => {
      const { idsToUpdate, userId } = payload;
      
      if (idsToUpdate.length) {
        state.viewedMessages = state.viewedMessages.filter((item) => !idsToUpdate.includes(item));
        
        idsToUpdate.forEach((item: EntityId) => {
          const seenBy = state.entities[item]?.seenBy;
          
          if (seenBy) {
            messagesAdapter.updateOne(state, { id: item, changes: { seenBy: [...seenBy, userId] } });
          }
        });
      }
    },
    addViewedMessage: (state, { payload }) => {
      const { messageId, userId } = payload;
      state.viewedMessages.push(messageId);
      
      const seenBy = state.entities[messageId].seenBy;

      if (!seenBy.includes(userId)) {
        messagesAdapter.updateOne(state, { id: messageId, changes: { seenBy: [...seenBy, userId] } });
      }
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

export const { setMessages, addViewedMessage, addMessage, updateUnseenMessage } = messagesSlice.actions;
