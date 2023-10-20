import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Debt, DebtDocument } from '../../schemas/debt.schema';
import { EventService } from '../event/event.service';
import { EventTypeEnum } from '../../types/event.types';

@Injectable()
export class DebtService {
  constructor(
    private eventService: EventService,
    @InjectModel(Debt.name)
    private debtModel: Model<DebtDocument>,
  ) {}

  async createDebt(req, dto) {
    const newDebt = await this.debtModel.insertMany([
      {
        ...dto,
        createdAt: new Date(),
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        repaidAmount: 0,
        author_id: req.user._id,
      },
    ]);

    await this.eventService.createEvent(
      req.user._id,
      EventTypeEnum.NewDebt,
      dto.neighborhood_id,
      newDebt[0]._id,
      [
        new mongoose.Types.ObjectId(req.user._id),
        new mongoose.Types.ObjectId(dto.debtor_id),
      ],
    );

    return this.getDebtById(newDebt[0]._id);
  }

  async editDebt(dto, id) {
    const editedDebt = await this.debtModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      },
    );

    return this.getDebtById(editedDebt._id);
  }

  async addPaymentDebt(id: string, value: number) {
    const debt = await this.getDebtById(id);

    if (debt[0].repaidAmount + value > debt[0].debtAmount) {
      return this.debtModel.findByIdAndUpdate(
        id,
        {
          repaidAmount: debt[0].debtAmount,
        },
        { new: true },
      );
    } else {
      return this.debtModel.findByIdAndUpdate(
        id,
        {
          repaidAmount: debt[0].repaidAmount + value,
        },
        { new: true },
      );
    }
  }

  getUserDebtsById(req, neighborhoodId) {
    return this.debtModel.aggregate([
      {
        $match: {
          $or: [
            { author_id: new mongoose.Types.ObjectId(req.user._id) },
            { debtor_id: new mongoose.Types.ObjectId(req.user._id) },
          ],
          neighborhood_id: new mongoose.Types.ObjectId(neighborhoodId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'debtor_id',
          foreignField: '_id',
          as: 'debtor',
        },
      },
      {
        $unwind: '$debtor',
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
        $project: {
          author: {
            firstName: 0,
            lastName: 0,
            password: 0,
            __v: 0,
          },
          debtor: {
            firstName: 0,
            lastName: 0,
            password: 0,
            __v: 0,
          },
          neighborhood_id: 0,
          debtor_id: 0,
          author_id: 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
  }

  getActiveUserDebtsById(req, neighborhoodId) {
    return this.debtModel.aggregate([
      {
        $match: {
          $or: [
            { author_id: new mongoose.Types.ObjectId(req.user._id) },
            { debtor_id: new mongoose.Types.ObjectId(req.user._id) },
          ],
          neighborhood_id: new mongoose.Types.ObjectId(neighborhoodId),
          $expr: { $lt: ['$repaidAmount', '$debtAmount'] },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'debtor_id',
          foreignField: '_id',
          as: 'debtor',
        },
      },
      {
        $unwind: '$debtor',
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
        $project: {
          author: {
            firstName: 0,
            lastName: 0,
            password: 0,
            __v: 0,
          },
          debtor: {
            firstName: 0,
            lastName: 0,
            password: 0,
            __v: 0,
          },
          neighborhood_id: 0,
          debtor_id: 0,
          author_id: 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
  }

  getAllUserDebts(req) {
    return this.debtModel.aggregate([
      {
        $match: {
          $or: [
            { author_id: new mongoose.Types.ObjectId(req.user._id) },
            { debtor_id: new mongoose.Types.ObjectId(req.user._id) },
          ],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'debtor_id',
          foreignField: '_id',
          as: 'debtor',
        },
      },
      {
        $unwind: '$debtor',
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
        $project: {
          author: {
            firstName: 0,
            lastName: 0,
            password: 0,
            __v: 0,
          },
          debtor: {
            firstName: 0,
            lastName: 0,
            password: 0,
            __v: 0,
          },
          neighborhood_id: 0,
          debtor_id: 0,
          author_id: 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
  }

  getDebtById(id: string) {
    return this.debtModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'users',
          localField: 'debtor_id',
          foreignField: '_id',
          as: 'debtor',
        },
      },
      {
        $unwind: '$debtor',
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
        $project: {
          author: {
            firstName: 0,
            lastName: 0,
            password: 0,
            __v: 0,
          },
          debtor: {
            firstName: 0,
            lastName: 0,
            password: 0,
            __v: 0,
          },
          neighborhood_id: 0,
          debtor_id: 0,
          author_id: 0,
        },
      },
    ]);
  }

  deleteDebt(id) {
    return this.debtModel.findByIdAndDelete(new mongoose.Types.ObjectId(id));
  }

  deleteAllDebtsByNeighborhoodId(neighborhoodId) {
    return this.debtModel.deleteMany({ neighborhood_id: neighborhoodId });
  }

  async closeDebt(id) {
    const debt = await this.getDebtById(id);

    return this.debtModel.findByIdAndUpdate(
      debt[0]._id,
      {
        repaidAmount: debt[0].debtAmount,
      },
      { new: true },
    );
  }
}
