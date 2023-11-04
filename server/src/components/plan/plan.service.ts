import { Injectable, UnauthorizedException } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Plan, PlanDocument } from '../../schemas/plan.schema';
import { ERRORS } from '../../constants/errors';
import { EventService } from '../event/event.service';
import { EventTypeEnum } from '../../types/event.types';
import { InvalidDataException } from '../../exception/invalidData.exception';

@Injectable()
export class PlanService {
  constructor(
    private eventService: EventService,
    @InjectModel(Plan.name)
    private planModel: Model<PlanDocument>,
  ) {}

  async createPlan(req, dto) {
    const participants: mongoose.Types.ObjectId[] = [
      ...dto.participants,
      new mongoose.Types.ObjectId(req.user._id),
    ];

    const newPlan = await this.planModel.create({
      ...dto,
      createdAt: new Date(),
      eventDate: dto.eventDate ? new Date(dto.eventDate) : null,
      author_id: req.user._id,
      isClosed: false,
      participants,
      participantPayments: [
        ...dto.participants.map((item) => {
          return {
            participant_id: item,
            payment: 0,
          };
        }),
        {
          participant_id: new mongoose.Types.ObjectId(req.user._id),
          payment: 0,
        },
      ],
    });

    await this.eventService.createEvent(
      req.user._id,
      EventTypeEnum.NewPlan,
      dto.neighborhood_id,
      newPlan._id,
      participants,
    );

    return this.getPlanById(newPlan._id);
  }

  async getUserPlans(req) {
    return this.planModel.aggregate([
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
          userDetails: 0,
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
      {
        $sort: { eventDate: -1 },
      },
    ]);
  }

  async getUserPlansById(req, neighborhoodId) {
    return this.planModel.aggregate([
      {
        $match: {
          participants: new mongoose.Types.ObjectId(req.user._id),
          neighborhood_id: new mongoose.Types.ObjectId(neighborhoodId),
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
          userDetails: 0,
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
      {
        $sort: { eventDate: -1 },
      },
    ]);
  }

  async getActiveUserPlansById(req, neighborhoodId) {
    return this.planModel.aggregate([
      {
        $match: {
          participants: new mongoose.Types.ObjectId(req.user._id),
          neighborhood_id: new mongoose.Types.ObjectId(neighborhoodId),
          isClosed: false,
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
          userDetails: 0,
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
      {
        $sort: { eventDate: -1 },
      },
    ]);
  }

  async changeTaskStatus(planId, taskId, req) {
    const document = await this.planModel.findById(planId);

    const taskToUpdate = document.tasksList.find(
      (item) => item._id.toString() === taskId,
    );

    if (taskToUpdate.completed) {
      if (taskToUpdate.completedBy.toString() !== req.user._id) {
        return new UnauthorizedException({ message: ERRORS.NO_ACCESS });
      }

      taskToUpdate.completed = false;
      taskToUpdate.completedBy = null;
      taskToUpdate.completedAt = null;
    } else {
      taskToUpdate.completed = true;
      taskToUpdate.completedBy = req.user._id;
      taskToUpdate.completedAt = new Date();
    }

    const updatedDocument = await document.save();

    return this.getPlanById(updatedDocument._id);
  }

  async addPayment(planId, req, amount) {
    const document = await this.planModel.findById(planId);

    const participantToUpdate = document.participantPayments.find(
      (item) => item.participant_id.toString() === req.user._id,
    );

    participantToUpdate.payment = participantToUpdate.payment + Number(amount);

    const updatedDocument = await document.save();

    await this.planModel.updateOne({ _id: planId }, updatedDocument);

    return this.getPlanById(updatedDocument._id);
  }

  async getPlanById(id: string | mongoose.Types.ObjectId) {
    const res = await this.planModel.aggregate([
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
          userDetails: 0,
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

  async closePlan(id) {
    const plan = await this.planModel.findByIdAndUpdate(id, {
      isClosed: true,
    });

    return this.getPlanById(plan._id);
  }

  removeUserFromAllPlansByUserId(neighborhoodId, userId) {
    return this.planModel.updateOne(
      { neighborhood_id: neighborhoodId },
      {
        $pull: {
          participants: userId,
          participantPayments: {
            participant_id: new mongoose.Types.ObjectId(userId),
          },
        },
      },
    );
  }

  async reopenPlan(id) {
    const plan = await this.planModel.findByIdAndUpdate(id, {
      isClosed: false,
    });

    return this.getPlanById(plan._id);
  }

  deletePlan(id) {
    return this.planModel.findByIdAndDelete(new mongoose.Types.ObjectId(id));
  }

  deleteAllPlansByNeighborhoodId(neighborhoodId) {
    return this.planModel.deleteMany({ neighborhood_id: neighborhoodId });
  }

  async editPlan(dto, id) {
    const editedPlan = await this.planModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      {
        ...dto,
        paymentAmount: dto.paymentAmount ? dto.paymentAmount : null,
        eventDate: dto.eventDate ? new Date(dto.eventDate) : null,
      },
    );

    return this.getPlanById(editedPlan._id);
  }

  async addParticipant(planId, participantId) {
    const isParticipant = await this.planModel.findOne({
      _id: planId,
      participants: participantId,
    });

    if (isParticipant) {
      throw new InvalidDataException({ message: ERRORS.INVALID_DATA });
    }

    await this.planModel.updateOne(
      { _id: planId },
      {
        $push: {
          participants: participantId,
          participantPayments: {
            participant_id: new mongoose.Types.ObjectId(participantId),
            payment: 0,
          },
        },
      },
    );

    return this.getPlanById(planId);
  }

  async removeParticipant(planId, participantId) {
    const isParticipant = await this.planModel.findOne({
      _id: planId,
      participants: participantId,
    });

    if (!isParticipant) {
      throw new InvalidDataException({ message: ERRORS.INVALID_DATA });
    }

    await this.planModel.updateOne(
      { _id: planId },
      {
        $pull: {
          participants: participantId,
          participantPayments: {
            participant_id: new mongoose.Types.ObjectId(participantId),
          },
        },
      },
    );

    return this.getPlanById(planId);
  }
}
