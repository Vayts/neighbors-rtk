import { createAsyncThunk, EntityId } from '@reduxjs/toolkit';
import { axiosPrivate } from '@src/api/api';
import { CHAT_ROUTES } from '@constants/routes';
import { errorManager } from '@helpers/errors.helper';
import { ErrorEnum } from '@src/types/default.types';
import { RootState } from '@src/store';
import { normalize } from 'normalizr';
import { messageSchema } from '@src/store/chats/schema';

const MODULE_NAME = 'messages';

export const updateViewedMessages = createAsyncThunk(
  `${MODULE_NAME}/updateViewed`,
  async (_, { rejectWithValue, getState }) => {
    try {
      const { messages } = getState() as RootState;
      const messageIds = messages.viewedMessages;
      
      if (messageIds.length) {
        await axiosPrivate.put(`${CHAT_ROUTES.updateSeenBy}`, { messageIds });
        
        return messageIds;
      }
      
      return [];
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.app);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);

export const loadMoreMessages = createAsyncThunk(
  `${MODULE_NAME}/loadMore`,
  async (id: EntityId, { rejectWithValue, getState }) => {
    try {
      const { chats } = getState() as RootState;
      const skipCounter = chats.entities[id].messages.length;
      const timeStamp = new Date().toISOString();
      const response = await axiosPrivate.get(`${CHAT_ROUTES.loadMoreMessages}?neighborhood_id=${id}&skip=${skipCounter}&date=${timeStamp}`);
      const { hasMoreMessages, messages } = response.data;
      
      const data = normalize(messages, [messageSchema]);
      
      return {
        ids: data.result,
        chat_id: id,
        entities: data.entities,
        hasMoreMessages,
      };
    } catch (e: any) {
      errorManager(e?.response?.data?.message, ErrorEnum.app);
      return rejectWithValue(e?.response?.data?.message);
    }
  },
);
