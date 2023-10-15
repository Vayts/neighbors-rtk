import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from '@src/store/auth/slice';
import { coreSlice } from '@src/store/core/slice';
import { userNeighborhoodsSlice } from '@src/store/userNeighborhoods/slice';
import { debtsSlice } from '@src/store/debts/slice';
import { debtorsSlice } from '@src/store/debtors/slice';
import { membersSlice } from '@src/store/members/slice';
import { participantsSlice } from '@src/store/participants/slice';
import { plansSlice } from '@src/store/plans/slice';
import { neighborhoodsSlice } from '@src/store/neighborhoodDebts/slice';
import { chatSocketMiddleware } from '@src/store/chats/chat.middleware';
import { messagesSlice } from '@src/store/messages/slice';
import { messageSendersSlice } from '@src/store/messageSenders/slice';
import { chatsSlice } from '@src/store/chats/slice';

export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [coreSlice.name]: coreSlice.reducer,
    [userNeighborhoodsSlice.name]: userNeighborhoodsSlice.reducer,
    [debtsSlice.name]: debtsSlice.reducer,
    [debtorsSlice.name]: debtorsSlice.reducer,
    [membersSlice.name]: membersSlice.reducer,
    [participantsSlice.name]: participantsSlice.reducer,
    [plansSlice.name]: plansSlice.reducer,
    [neighborhoodsSlice.name]: neighborhoodsSlice.reducer,
    [messagesSlice.name]: messagesSlice.reducer,
    [messageSendersSlice.name]: messageSendersSlice.reducer,
    [chatsSlice.name]: chatsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(chatSocketMiddleware('ws://localhost:4020')),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
