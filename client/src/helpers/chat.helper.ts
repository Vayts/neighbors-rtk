import { IChatRoom } from '@src/types/chat.types';

export function getSelectedChatById(rooms: IChatRoom[], id: string): IChatRoom | undefined {
  return rooms.find((item) => item.chat_id === id);
}
