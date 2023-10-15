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
    const filter = {
      seenBy: {
        $not: {
          $in: [new mongoose.Types.ObjectId(userId)],
        },
      },
    };

    const updatedIds = await this.messageModel.distinct('_id', filter);

    if (updatedIds.length) {
      const update = {
        $addToSet: {
          seenBy: new mongoose.Types.ObjectId(userId),
        },
      };

      await this.messageModel.updateMany(filter, update);
    }

    const result = await this.messageModel.insertMany([
      {
        author_id: new mongoose.Types.ObjectId(userId),
        chat_id: new mongoose.Types.ObjectId(neighborhoodId),
        text: message,
        sentAt: new Date(),
        seenBy: [new mongoose.Types.ObjectId(userId)],
      },
    ]);

    const addedMessage = await this.getMessageById(result[0]._id);

    return {
      message: addedMessage[0],
      idsToUpdate: updatedIds,
    };
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

  updateMessageSeenBy(messageIds, req) {
    return this.messageModel.updateMany(
      { _id: { $in: messageIds } },
      { $addToSet: { seenBy: new mongoose.Types.ObjectId(req.user._id) } },
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
          _id: '$chat_id',
          notificationCounter: 1,
          messages: { $slice: ['$messages', -MESSAGES_PER_PAGE] },
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
      {
        $sort: { name: -1 },
      },
    ]);
  }

  async loadMoreMessages(neighborhoodId, skip, date) {
    // const nextPage = Number(page) + 1;
    // const currentMessageCounter = nextPage * MESSAGES_PER_PAGE;
    // const skipAmount = page * MESSAGES_PER_PAGE;
    const result = await this.messageModel.aggregate([
      { $match: { chat_id: new mongoose.Types.ObjectId(neighborhoodId) } },
      {
        $match: { sentAt: { $lte: new Date(date) } }, // Выбираем сообщения, отправленные до или в момент targetDate
      },
      {
        $sort: { sentAt: -1 },
      },
      {
        $facet: {
          totalMessages: [{ $count: 'count' }],
          messages: [
            { $skip: Number(skip) },
            { $limit: MESSAGES_PER_PAGE },
            {
              $sort: { sentAt: 1 },
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
              $unwind: '$author',
            },
            {
              $addFields: {
                chat_id: neighborhoodId,
              },
            },
            {
              $project: {
                'author.password': 0,
                'author.login': 0,
                author_id: 0,
              },
            },
          ],
        },
      },
    ]);

    const hasMoreMessages = result[0].totalMessages[0]
      ? result[0].totalMessages[0].count > Number(skip) + MESSAGES_PER_PAGE
      : false;

    return {
      messages: result[0].messages,
      hasMoreMessages,
    };
  }
}
