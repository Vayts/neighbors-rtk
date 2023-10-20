import { UserDocument } from '../schemas/user.schema';

export class SimpleUserDto {
  constructor(user: UserDocument) {
    this.fullName = user.fullName;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.login = user.login;
    this._id = user._id;
    this.avatar = user.avatar;
  }
  _id: string;
  login: string;
  avatar: string;
  fullName: string;
  firstName: string;
  lastName: string;
}
