import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/create-user.dto';

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

  async getUserByLogin(login: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ login });
    return user;
  }
}
