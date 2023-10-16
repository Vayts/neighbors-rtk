import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IMember } from '@src/types/user.types';
import { getUserNeighborhoods } from '@src/store/userNeighborhoods/thunks';
import { loadMoreMessages } from '@src/store/messages/thunks';

export const membersAdapter = createEntityAdapter<IMember>({ selectId: (entity) => entity?._id });

export const membersSlice = createSlice({
  name: 'members',
  initialState: membersAdapter.getInitialState(),
  reducers: {
    addMember: (state, { payload }) => {
      if (!state.entities.hasOwnProperty(payload._id)) {
        membersAdapter.upsertOne(state, payload);
      }
    },
    addMembers: (state, { payload }) => {
      const members = payload.members ?? {};
      
      Object.keys(members).forEach((key) => {
        if (state.ids.includes(key)) {
          delete members[key];
        }
      });
      
      if (Object.keys(members)) {
        membersAdapter.upsertMany(state, members);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserNeighborhoods.fulfilled, (state, { payload }) => {
        membersAdapter.setAll(state, payload?.members ?? {});
      })
      .addCase(loadMoreMessages.fulfilled, (state, { payload }) => {
        const members = payload.entities.members ?? {};
        
        Object.keys(members).forEach((key) => {
          if (state.ids.includes(key)) {
            delete members[key];
          }
        });
        
        if (Object.keys(members)) {
          membersAdapter.upsertMany(state, members);
        }
      });
  },
});

export const { addMember, addMembers } = membersSlice.actions;
