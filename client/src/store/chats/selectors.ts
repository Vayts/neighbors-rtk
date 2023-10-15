import { RootState } from '@src/store';
import { chatsAdapter } from '@src/store/chats/slice';

export const {
  selectAll: selectAllChatRooms,
} = chatsAdapter.getSelectors((state: RootState) => state.chats);
