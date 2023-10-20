import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventService } from './event.service';
import {
  Neighborhood_Event,
  Neighborhood_EventSchema,
} from '../../schemas/neighborhood_event.schema';

@Global()
@Module({
  providers: [EventService],
  controllers: [],
  imports: [
    MongooseModule.forFeature([
      { name: Neighborhood_Event.name, schema: Neighborhood_EventSchema },
    ]),
  ],
  exports: [EventService],
})
export class EventModule {}
