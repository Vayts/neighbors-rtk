import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import mongoose, { Model } from 'mongoose';
import {
  Neighborhood,
  NeighborhoodDocument,
} from '../../schemas/neighborhood.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  Neighborhood_User,
  Neighborhood_UserDocument,
} from '../../schemas/neighborhood_user.schema';
import {
  Neighborhood_Invite,
  Neighborhood_InviteDocument,
} from '../../schemas/neighborhood_invite.schema';
import { DebtService } from '../debt/debt.service';
import { PlanService } from '../plan/plan.service';

@Injectable()
export class NeighborhoodService {
  constructor(
    private jwtService: JwtService,
    private debtService: DebtService,
    private planService: PlanService,
    @InjectModel(Neighborhood.name)
    private neighborhoodModel: Model<NeighborhoodDocument>,
    @InjectModel(Neighborhood_User.name)
    private neighborhoodUserModel: Model<Neighborhood_UserDocument>,
    @InjectModel(Neighborhood_Invite.name)
    private neighborhoodInviteModel: Model<Neighborhood_InviteDocument>,
  ) {}

  async createNeighborhood(req, dto) {
    const creatorId = req.user._id;

    try {
      const neighborhood = await this.neighborhoodModel.insertMany([
        {
          ...dto,
          createdAt: Date.now(),
        },
      ]);

      await this.neighborhoodUserModel.insertMany([
        {
          user_id: new mongoose.Types.ObjectId(creatorId),
          role: 'admin',
          neighborhood_id: new mongoose.Types.ObjectId(neighborhood[0]._id),
        },
      ]);

      return this.getFullNeighborhoodByIdAndMemberId(
        neighborhood[0]._id,
        req.user._id,
      );
    } catch {
      throw new HttpException(
        { message: 'SOMETHING_WENT_WRONG' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getNeighborhoodByInviteCode(code) {
    const neighborhood = await this.neighborhoodInviteModel.aggregate([
      {
        $match: {
          code,
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
          expirationDate: 1,
          neighborhood: 1,
          _id: 0,
        },
      },
    ]);

    return neighborhood[0];
  }

  async joinNeighborhoodByInviteCode(req, code) {
    const neighborhood = await this.neighborhoodInviteModel.findOne({ code });

    await this.neighborhoodUserModel.insertMany([
      {
        user_id: req.user._id,
        role: 'member',
        neighborhood_id: neighborhood.neighborhood_id,
      },
    ]);

    return this.getFullNeighborhoodByIdAndMemberId(
      neighborhood.neighborhood_id,
      req.user._id,
    );
  }

  getNeighborhoodByMemberIdAndId(userId, neighborhoodId) {
    return this.neighborhoodUserModel.findOne({
      user_id: new mongoose.Types.ObjectId(userId),
      neighborhood_id: new mongoose.Types.ObjectId(neighborhoodId),
    });
  }

  setFavorite(userId, neighborhoodId) {
    return this.neighborhoodUserModel.findOneAndUpdate(
      { user_id: userId, neighborhood_id: neighborhoodId },
      { isFavorite: true },
    );
  }

  removeFavorite(userId, neighborhoodId) {
    return this.neighborhoodUserModel.findOneAndUpdate(
      { user_id: userId, neighborhood_id: neighborhoodId },
      { isFavorite: false },
    );
  }

  getUserNeighborhoods(userId) {
    return this.neighborhoodUserModel.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(userId),
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
          'neighborhood.role': '$role',
        },
      },
      {
        $addFields: {
          'neighborhood.isFavorite': '$isFavorite',
        },
      },
      {
        $lookup: {
          from: 'neighborhood_users',
          localField: 'neighborhood_id',
          foreignField: 'neighborhood_id',
          as: 'members',
        },
      },
      {
        $unwind: '$members',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'members.user_id',
          foreignField: '_id',
          as: 'members.userDetails',
        },
      },
      {
        $unwind: '$members.userDetails',
      },
      {
        $group: {
          _id: '$_id',
          neighborhood: { $first: '$neighborhood' },
          members: {
            $push: {
              role: '$members.role',
              _id: '$members.userDetails._id',
              fullName: '$members.userDetails.fullName',
              firstName: '$members.userDetails.firstName',
              lastName: '$members.userDetails.lastName',
              avatar: '$members.userDetails.avatar',
              login: '$members.userDetails.login',
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          neighborhood: { $first: '$neighborhood' },
          members: { $first: '$members' },
        },
      },
      {
        $addFields: {
          'neighborhood.members': '$members',
        },
      },
      {
        $project: {
          'neighborhood.members.userDetails.password': 0,
        },
      },
      {
        $replaceRoot: { newRoot: '$neighborhood' },
      },
      {
        $sort: { name: -1 },
      },
    ]);
  }

  getFullNeighborhoodByIdAndMemberId(id, memberId) {
    return this.neighborhoodUserModel.aggregate([
      {
        $match: {
          neighborhood_id: new mongoose.Types.ObjectId(id),
          user_id: new mongoose.Types.ObjectId(memberId),
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
          'neighborhood.role': '$role',
        },
      },
      {
        $lookup: {
          from: 'neighborhood_users',
          localField: 'neighborhood_id',
          foreignField: 'neighborhood_id',
          as: 'members',
        },
      },
      {
        $unwind: '$members',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'members.user_id',
          foreignField: '_id',
          as: 'members.userDetails',
        },
      },
      {
        $unwind: '$members.userDetails',
      },
      {
        $group: {
          _id: '$_id',
          neighborhood: { $first: '$neighborhood' },
          members: {
            $push: {
              role: '$members.role',
              _id: '$members.userDetails._id',
              fullName: '$members.userDetails.fullName',
              firstName: '$members.userDetails.firstName',
              lastName: '$members.userDetails.lastName',
              avatar: '$members.userDetails.avatar',
              login: '$members.userDetails.login',
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          neighborhood: { $first: '$neighborhood' },
          members: { $first: '$members' },
        },
      },
      {
        $addFields: {
          'neighborhood.members': '$members',
        },
      },
      {
        $project: {
          'neighborhood.members.userDetails.password': 0,
        },
      },
      {
        $replaceRoot: { newRoot: '$neighborhood' },
      },
    ]);
  }

  getNeighborhoodById(id) {
    return this.neighborhoodUserModel.aggregate([
      {
        $match: {
          neighborhood_id: new mongoose.Types.ObjectId(id),
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
          'neighborhood.role': '$role',
        },
      },
      {
        $lookup: {
          from: 'neighborhood_users',
          localField: 'neighborhood_id',
          foreignField: 'neighborhood_id',
          as: 'members',
        },
      },
      {
        $unwind: '$members',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'members.user_id',
          foreignField: '_id',
          as: 'members.userDetails',
        },
      },
      {
        $unwind: '$members.userDetails',
      },
      {
        $group: {
          _id: '$_id',
          neighborhood: { $first: '$neighborhood' },
          members: {
            $push: {
              role: '$members.role',
              _id: '$members.userDetails._id',
              fullName: '$members.userDetails.fullName',
              firstName: '$members.userDetails.firstName',
              lastName: '$members.userDetails.lastName',
              avatar: '$members.userDetails.avatar',
              login: '$members.userDetails.login',
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          neighborhood: { $first: '$neighborhood' },
          members: { $first: '$members' },
        },
      },
      {
        $addFields: {
          'neighborhood.members': '$members',
        },
      },
      {
        $project: {
          'neighborhood.members.userDetails.password': 0,
        },
      },
      {
        $replaceRoot: { newRoot: '$neighborhood' },
      },
    ]);
  }

  async getCurrentNeighborhood(id, req) {
    const neighborhood = await this.neighborhoodModel.findById(id);
    const members = await this.neighborhoodUserModel.aggregate([
      { $match: { neighborhood_id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $addFields: {
          'user.role': '$role',
        },
      },
      {
        $replaceRoot: { newRoot: '$user' },
      },
      {
        $project: {
          password: 0,
          __v: 0,
        },
      },
    ]);

    const debts = await this.debtService.getUserDebts(req);
    const plans = await this.planService.getUserPlans(req);

    return {
      neighborhood,
      members,
      debtCounter: debts.length,
      planCounter: plans.length,
    };
  }
}
