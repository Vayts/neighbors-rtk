import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Duty, DutyDocument } from '../../schemas/duty.schema';
import { Duty_Mark, Duty_MarkDocument } from '../../schemas/duty_mark.schema';
import { InvalidDataException } from '../../exception/invalidData.exception';
import { ERRORS } from '../../constants/errors';

@Injectable()
export class DutyService {
  constructor(
    @InjectModel(Duty.name)
    private dutyModel: Model<DutyDocument>,
    @InjectModel(Duty_Mark.name)
    private dutyMarkModel: Model<Duty_MarkDocument>,
  ) {}

  async create(req, dto) {
    const participants: mongoose.Types.ObjectId[] = [
      ...dto.participants,
      new mongoose.Types.ObjectId(req.user._id),
    ];

    const newDuty = await this.dutyModel.create({
      ...dto,
      author_id: req.user._id,
      participants: participants,
      createdAt: new Date(),
    });

    return this.getById(newDuty._id);
  }

  async edit(dto, id) {
    const editedDebt = await this.dutyModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      {
        ...dto,
      },
    );

    return this.getById(editedDebt._id);
  }

  addMark(req, query, date) {
    return this.dutyMarkModel.create({
      duty_id: new mongoose.Types.ObjectId(query.duty_id),
      author_id: new mongoose.Types.ObjectId(req.user._id),
      date: new Date(date),
      neighborhood_id: new mongoose.Types.ObjectId(query.neighborhood_id),
      createdAt: new Date(),
    });
  }

  async delete(req, dutyId) {
    await this.dutyMarkModel.deleteMany({
      duty_id: dutyId,
    });

    return this.dutyModel.findOneAndRemove(
      {
        _id: dutyId,
        author_id: req.user._id,
      },
      { new: true },
    );
  }

  deleteMark(req, markId) {
    return this.dutyMarkModel.findOneAndRemove(
      {
        _id: markId,
        author_id: req.user._id,
      },
      { new: true },
    );
  }

  async getById(id) {
    const res = await this.dutyModel.aggregate([
      {
        $match: {
          _id: typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'participants',
          foreignField: '_id',
          as: 'participants',
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
        $unwind: '$author',
      },
      {
        $lookup: {
          from: 'duty_marks',
          localField: '_id',
          foreignField: 'duty_id',
          as: 'dutyMarks',
        },
      },
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
        $addFields: {
          currentPayment: { $sum: '$participantPayments.payment' },
        },
      },
      {
        $project: {
          author: {
            firstName: 0,
            lastName: 0,
            password: 0,
            __v: 0,
          },
          neighborhood_id: 0,
          author_id: 0,
          'participants.participant_id': 0,
          'participants.password': 0,
          'participants.__v': 0,
          'participants.login': 0,
        },
      },
    ]);

    return res[0];
  }

  async clearUserByNeighborhood(neighborhoodId, userId) {
    await this.dutyMarkModel.deleteMany({
      neighborhood_id: neighborhoodId,
      author_id: userId,
    });

    return this.dutyModel.updateMany(
      { participants: userId },
      { $pull: { participants: userId } },
    );
  }

  getDutyMarkByDateAndDutyId(date, dutyId) {
    return this.dutyMarkModel.findOne({
      date: date,
      duty_id: dutyId,
    });
  }

  getDutyMarkById(id) {
    return this.dutyMarkModel.findOne({
      _id: id,
    });
  }

  async getByNeighborhoodId(req, neighborhoodId) {
    return this.dutyModel.aggregate([
      {
        $match: {
          neighborhood_id: new mongoose.Types.ObjectId(neighborhoodId),
          participants: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'participants',
          foreignField: '_id',
          as: 'participants',
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
        $unwind: '$author',
      },
      {
        $lookup: {
          from: 'duty_marks',
          localField: '_id',
          foreignField: 'duty_id',
          as: 'dutyMarks',
        },
      },
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
        $project: {
          author: {
            firstName: 0,
            lastName: 0,
            password: 0,
            __v: 0,
          },
          neighborhood_id: 0,
          author_id: 0,
          'participants.participant_id': 0,
          'participants.password': 0,
          'participants.__v': 0,
          'participants.login': 0,
        },
      },
    ]);
  }

  async getAll(req) {
    return this.dutyModel.aggregate([
      {
        $match: {
          participants: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'participants',
          foreignField: '_id',
          as: 'participants',
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
        $unwind: '$author',
      },
      {
        $lookup: {
          from: 'duty_marks',
          localField: '_id',
          foreignField: 'duty_id',
          as: 'dutyMarks',
        },
      },
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
        $project: {
          author: {
            firstName: 0,
            lastName: 0,
            password: 0,
            __v: 0,
          },
          neighborhood_id: 0,
          author_id: 0,
          'participants.participant_id': 0,
          'participants.password': 0,
          'participants.__v': 0,
          'participants.login': 0,
        },
      },
    ]);
  }

  async addParticipant(dutyId, participantId) {
    const isParticipant = await this.dutyModel.findOne({
      _id: dutyId,
      participants: participantId,
    });

    if (isParticipant) {
      throw new InvalidDataException({ message: ERRORS.INVALID_DATA });
    }

    await this.dutyModel.updateOne(
      { _id: dutyId },
      { $push: { participants: participantId } },
    );

    return this.getById(dutyId);
  }

  async removeParticipant(dutyId, participantId) {
    const isParticipant = await this.dutyModel.findOne({
      _id: dutyId,
      participants: participantId,
    });

    if (!isParticipant) {
      throw new InvalidDataException({ message: ERRORS.INVALID_DATA });
    }

    await this.dutyMarkModel.deleteMany({
      duty_id: dutyId,
      author_id: participantId,
    });

    await this.dutyModel.updateOne(
      { _id: dutyId },
      { $pull: { participants: participantId } },
    );

    return this.getById(dutyId);
  }
}
