import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { InvalidDataException } from '../../exception/invalidData.exception';
import { ERRORS } from '../../constants/errors';
import { ChangePasswordDto } from '../../dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  createUser(dto: CreateUserDto): Promise<UserDocument[]> {
    return this.userModel.insertMany([
      {
        ...dto,
        fullName: `${dto.firstName} ${dto.lastName}`,
        avatar: 'avatar4.png',
      },
    ]);
  }

  async updateUserInfo(req, dto: UpdateUserDto) {
    const result = await this.userModel
      .findOneAndUpdate(
        { _id: req.user._id },
        {
          ...dto,
          fullName: `${dto.firstName} ${dto.lastName}`,
        },
        { new: true },
      )
      .exec();

    return {
      firstName: result.firstName,
      lastName: result.lastName,
      avatar: result.avatar,
      fullName: result.fullName,
    };
  }

  async changePassword(req, dto: ChangePasswordDto) {
    const user = await this.getUserById(req.user._id);

    if (dto.confirmPassword !== dto.password) {
      throw new InvalidDataException({ message: ERRORS.PASSWORD_DONT_MATCH });
    }

    try {
      const isPasswordCorrect = await bcrypt.compare(
        dto.currentPassword,
        user.password,
      );

      if (isPasswordCorrect) {
        const hashPassword = await bcrypt.hash(dto.password, 10);

        await this.userModel.findOneAndUpdate(
          { _id: req.user._id },
          { password: hashPassword },
        );
      } else {
        throw new InvalidDataException({ message: ERRORS.WRONG_PASSWORD });
      }
    } catch {
      throw new InvalidDataException({ message: ERRORS.WRONG_PASSWORD });
    }
  }

  async getUserByLogin(login: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ login });
    return user;
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ _id: id });
    return user;
  }
}
