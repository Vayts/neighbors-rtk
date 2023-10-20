import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import {
  Neighborhood_EventDocument,
  Neighborhood_Event,
} from '../../schemas/neighborhood_event.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Neighborhood_Event.name)
    private eventModel: Model<Neighborhood_EventDocument>,
  ) {}

  createEvent(
    author,
    type,
    neighborhoodId,
    link = null,
    recipients: string | mongoose.Types.ObjectId[] = 'all',
  ) {
    return this.eventModel.insertMany([
      {
        author_id: author,
        neighborhood_id: neighborhoodId,
        createdAt: new Date(),
        type,
        recipients,
        link,
      },
    ]);
  }

  getEventsInNeighborhoodAndRecipient(neighborhoodId, userId) {
    return this.eventModel.aggregate([
      {
        $match: {
          neighborhood_id: new mongoose.Types.ObjectId(neighborhoodId),
          $or: [
            { recipients: 'all' },
            {
              recipients: {
                $elemMatch: { $eq: new mongoose.Types.ObjectId(userId) },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author_id',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $project: {
          'author.password': 0,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
  }
}
