import { MessageDocument } from '../schemas/message.schema';

export interface ServerToClientChatEvents {
  receiveMessage: (payload: MessageDocument) => void;
  getAllMessages: (payload: MessageDocument[]) => void;
  [k: string]: (any: any) => void;
}
