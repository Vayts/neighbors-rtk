import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from '@src/store/auth/slice';
import { coreSlice } from '@src/store/core/slice';
import { userNeighborhoodsSlice } from '@src/store/userNeighborhoods/slice';
import { debtsSlice } from '@src/store/debts/slice';
import { debtorsSlice } from '@src/store/debtors/slice';
import { membersSlice } from '@src/store/members/slice';
import { plansSlice } from '@src/store/plans/slice';
import { neighborhoodsSlice } from '@src/store/neighborhoods/slice';
import { chatSocketMiddleware } from '@src/store/chats/chat.middleware';
import { messagesSlice } from '@src/store/messages/slice';
import { chatsSlice } from '@src/store/chats/slice';
import { currentNeighborhoodSlice } from '@src/store/currentNeighborhood/slice';
import { eventsSlice } from '@src/store/events/slice';
import { dutiesSlice } from '@src/store/duties/slice';

export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [coreSlice.name]: coreSlice.reducer,
    [userNeighborhoodsSlice.name]: userNeighborhoodsSlice.reducer,
    [debtsSlice.name]: debtsSlice.reducer,
    [debtorsSlice.name]: debtorsSlice.reducer,
    [membersSlice.name]: membersSlice.reducer,
    [plansSlice.name]: plansSlice.reducer,
    [neighborhoodsSlice.name]: neighborhoodsSlice.reducer,
    [messagesSlice.name]: messagesSlice.reducer,
    [chatsSlice.name]: chatsSlice.reducer,
    [currentNeighborhoodSlice.name]: currentNeighborhoodSlice.reducer,
    [eventsSlice.name]: eventsSlice.reducer,
    [dutiesSlice.name]: dutiesSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(chatSocketMiddleware('ws://localhost:4020')),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
