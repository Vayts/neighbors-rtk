import { NeighborhoodRoleEnum } from '@src/types/neighborhood.types';

export interface IUser {
  _id: string,
  firstName: string,
  lastName: string,
  fullName: string,
  avatar: string,
  login: string,
  token: string,
}

export interface IMember {
  _id: string,
  fullName: string,
  avatar: string,
  login: string,
  firstName: string,
  lastName: string,
  role: NeighborhoodRoleEnum,
}
