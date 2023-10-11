import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../../schemas/message.schema';
import { JwtModule } from '@nestjs/jwt';
import { NeighborhoodModule } from '../neighborhood/neighborhood.module';
import {
  Neighborhood,
  NeighborhoodSchema,
} from '../../schemas/neighborhood.schema';
import {
  Neighborhood_User,
  Neighborhood_UserSchema,
} from '../../schemas/neighborhood_user.schema';
import { ChatController } from './chat.controller';

@Module({
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Neighborhood.name, schema: NeighborhoodSchema },
      { name: Neighborhood_User.name, schema: Neighborhood_UserSchema },
    ]),
    JwtModule.register({}),
    NeighborhoodModule,
  ],
  exports: [],
})
export class ChatModule {}
