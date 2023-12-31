import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IMember } from '@src/types/user.types';
import { getUserNeighborhoods, joinNeighborhoodByCode } from '@src/store/userNeighborhoods/thunks';
import { loadMoreMessages } from '@src/store/messages/thunks';
import { getCurrentNeighborhood } from '@src/store/currentNeighborhood/thunks';
import { getUserDuties } from '@src/store/duties/thunks';
import { createPlan, getUserPlans } from '@src/store/plans/thunks';

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
      })
      .addCase(joinNeighborhoodByCode.fulfilled, (state, { payload }) => {
        const members = payload.members ?? {};
        
        Object.keys(members).forEach((key) => {
          if (state.ids.includes(key)) {
            delete members[key];
          }
        });
        
        if (Object.keys(members)) {
          membersAdapter.upsertMany(state, members);
        }
      })
      .addCase(getUserDuties.fulfilled, (state, { payload }) => {
        const members = payload.members ?? {};

        Object.keys(members).forEach((key) => {
          if (state.ids.includes(key)) {
            delete members[key];
          }
        });

        if (Object.keys(members)) {
          membersAdapter.upsertMany(state, members);
        }
      })
      .addCase(getUserPlans.fulfilled, (state, { payload }) => {
        const members = payload.participants ?? {};
        
        Object.keys(members).forEach((key) => {
          if (state.ids.includes(key)) {
            delete members[key];
          }
        });
        
        if (Object.keys(members)) {
          membersAdapter.upsertMany(state, members);
        }
      })
      .addCase(createPlan.fulfilled, (state, { payload }) => {
        const members = payload.participants ?? {};
        
        Object.keys(members).forEach((key) => {
          if (state.ids.includes(key)) {
            delete members[key];
          }
        });
        
        if (Object.keys(members)) {
          membersAdapter.upsertMany(state, members);
        }
      })
      .addCase(getCurrentNeighborhood.fulfilled, (state, { payload }) => {
        const members = payload.members ?? {};
        
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
