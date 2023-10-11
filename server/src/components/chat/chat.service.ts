import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Message, MessageDocument } from '../../schemas/message.schema';
import {
  Neighborhood,
  NeighborhoodDocument,
} from '../../schemas/neighborhood.schema';
import {
  Neighborhood_User,
  Neighborhood_UserDocument,
} from '../../schemas/neighborhood_user.schema';
import { MESSAGES_PER_PAGE } from '../../constants/app.constants';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
    @InjectModel(Neighborhood.name)
    private neighborhoodModel: Model<NeighborhoodDocument>,
    @InjectModel(Neighborhood_User.name)
    private neighborhoodUserModel: Model<Neighborhood_UserDocument>,
  ) {}

  async postMessage(userId, message, neighborhoodId): Promise<any> {
    const result = await this.messageModel.insertMany([
      {
        author_id: new mongoose.Types.ObjectId(userId),
        chat_id: new mongoose.Types.ObjectId(neighborhoodId),
        text: message,
        sentAt: new Date(),
        seenBy: [userId],
      },
    ]);

    return this.getMessageById(result[0]._id);
  }

  getMessageById(id: string) {
    return this.messageModel.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: 'users',
          localField: 'author_id',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $unwind: '$author',
      },
    ]);
  }

  getAllMessagesByNeighborhood(neighborhoodId) {
    return this.messageModel.aggregate([
      { $match: { chat_id: new mongoose.Types.ObjectId(neighborhoodId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'author_id',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $unwind: '$author',
      },
      { $sort: { sentAt: 1 } },
    ]);
  }

  updateMessageSeenBy(messageIds, req) {
    return this.messageModel.updateMany(
      { _id: { $in: messageIds } },
      { $push: { seenBy: req.user._id } },
    );
  }

  getChatRoomsByUserId(userId) {
    return this.neighborhoodUserModel.aggregate([
      { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'neighborhoods',
          localField: 'neighborhood_id',
          foreignField: '_id',
          as: 'neighborhood',
        },
      },
      {
        $unwind: '$neighborhood',
      },
      {
        $lookup: {
          from: 'messages',
          localField: 'neighborhood_id',
          foreignField: 'chat_id',
          as: 'messages',
        },
      },
      {
        $unwind: {
          path: '$messages',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { 'messages.sentAt': 1 },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'messages.author_id',
          foreignField: '_id',
          as: 'messages.author',
        },
      },
      {
        $unwind: {
          path: '$messages.author',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          avatar: { $first: '$neighborhood.avatar' },
          name: { $first: '$neighborhood.name' },
          chat_id: { $first: '$neighborhood_id' },
          _id: '$_id',
          messages: { $push: '$messages' },
        },
      },
      {
        $addFields: {
          messages: {
            $cond: {
              if: {
                $eq: [
                  { $type: { $arrayElemAt: ['$messages._id', 0] } },
                  'missing',
                ],
              },
              then: [],
              else: '$messages',
            },
          },
        },
      },
      {
        $addFields: {
          hasMoreMessages: {
            $cond: {
              if: { $gte: [{ $size: '$messages' }, MESSAGES_PER_PAGE] },
              then: true,
              else: false,
            },
          },
          page: 1,
          notificationCounter: 0,
        },
      },
      {
        $project: {
          avatar: 1,
          name: 1,
          chat_id: 1,
          hasMoreMessages: 1,
          page: 1,
          notificationCounter: 1,
          messages: { $slice: ['$messages', 0, MESSAGES_PER_PAGE] },
        },
      },
      {
        $project: {
          'messages.author.password': 0,
          'messages.author.login': 0,
          'messages.author.firstName': 0,
          'messages.author.lastName': 0,
          'messages.author.__v': 0,
          'messages.author_id': 0,
        },
      },
    ]);
  }
}
