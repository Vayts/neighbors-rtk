import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../../schemas/message.schema';

import { ChatController } from './chat.controller';
import {
  Neighborhood,
  NeighborhoodSchema,
} from '../../schemas/neighborhood.schema';
import {
  Neighborhood_User,
  Neighborhood_UserSchema,
} from '../../schemas/neighborhood_user.schema';

@Module({
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Neighborhood.name, schema: NeighborhoodSchema },
      { name: Neighborhood_User.name, schema: Neighborhood_UserSchema },
    ]),
  ],
  exports: [],
})
export class ChatModule {}
