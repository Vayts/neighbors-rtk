import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Plan, PlanDocument } from '../../schemas/plan.schema';
import { ERRORS } from '../../constants/errors';

@Injectable()
export class PlanService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Plan.name)
    private planModel: Model<PlanDocument>,
  ) {}

  async createPlan(req, dto) {
    const newPlan = await this.planModel.insertMany([
      {
        ...dto,
        createdAt: new Date(),
        eventDate: dto.eventDate ? new Date(dto.eventDate) : null,
        author_id: req.user._id,
        isClosed: false,
        participants: [
          ...dto.participants,
          {
            participant_id: new mongoose.Types.ObjectId(req.user._id),
            payment: 0,
          },
        ],
      },
    ]);

    return this.getPlanById(newPlan[0]._id);
  }

  async getUserPlans(req) {
    const neighborhoodId = req.query.neighborhood_id;

    const matchStage: any = [
      {
        $match: {
          'participants.participant_id': new mongoose.Types.ObjectId(
            req.user._id,
          ),
        },
      },
    ];

    if (neighborhoodId) {
      matchStage.push({
        $match: {
          neighborhood_id: new mongoose.Types.ObjectId(neighborhoodId),
        },
      });
    }

    const res = await this.planModel.aggregate([
      ...matchStage,
      {
        $lookup: {
          from: 'users',
          localField: 'participants.participant_id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $addFields: {
          participants: {
            $map: {
              input: '$participants',
              as: 'participant',
              in: {
                $mergeObjects: [
                  '$$participant',
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$userDetails',
                          as: 'userDetail',
                          cond: {
                            $eq: [
                              '$$userDetail._id',
                              '$$participant.participant_id',
                            ],
                          },
                        },
                      },
                      0,
                    ],
                  },
                ],
              },
            },
          },
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
          currentPayment: { $sum: '$participants.payment' },
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

    return res;
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

    const participantToUpdate = document.participants.find(
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
          localField: 'participants.participant_id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $addFields: {
          participants: {
            $map: {
              input: '$participants',
              as: 'participant',
              in: {
                $mergeObjects: [
                  '$$participant',
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$userDetails',
                          as: 'userDetail',
                          cond: {
                            $eq: [
                              '$$userDetail._id',
                              '$$participant.participant_id',
                            ],
                          },
                        },
                      },
                      0,
                    ],
                  },
                ],
              },
            },
          },
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
          currentPayment: { $sum: '$participants.payment' },
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

  async reopenPlan(id) {
    const plan = await this.planModel.findByIdAndUpdate(id, {
      isClosed: false,
    });

    return this.getPlanById(plan._id);
  }

  deletePlan(id) {
    return this.planModel.findByIdAndDelete(new mongoose.Types.ObjectId(id));
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
}
