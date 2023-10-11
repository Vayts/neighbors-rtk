import { ErrorType } from '@src/types/default.types';
import { IMember, IUser } from '@src/types/user.types';
import { INeighborhood } from '@src/types/neighborhood.types';

export interface ICreatePlan {
  name: string,
  description: string,
  neighborhood_id: string,
  isPaymentRequired: boolean,
  isAllMembersInvited: boolean,
  participants: string[],
  eventDate: Date | null,
  paymentAmount: string,
  tasksList: ICreatePlanTask[],
  isTasksListRequired: boolean,
  errors: ErrorType,
}

export interface IEditPlan {
  name: string,
  description: string,
  paymentAmount: string,
  eventDate: Date | null,
  errors: ErrorType,
}

export interface IEditPlanDto {
  name: string,
  description: string,
  paymentAmount: string | null,
  eventDate: string | null,
}

export interface IPlan {
  _id: string,
  author: IUser,
  neighborhood: INeighborhood,
  name: string,
  description: string,
  createdAt: Date,
  isPaymentRequired: boolean,
  participants: IPlanParticipant[],
  eventDate: Date | null,
  paymentAmount: number | null,
  currentPayment: number,
  isClosed: boolean,
  tasksList: IPlanTask[],
}

export interface IPlanParticipant extends IMember{
  payment: number,
}

export interface IPlanTask {
  _id: string,
  completedBy: string;
  completedAt: Date | null,
  completed: boolean;
  text: string;
}

export interface ICreatePlanDto {
  name: string,
  description: string,
  neighborhood_id: string,
  isPaymentRequired: boolean,
  participants: string[],
  eventDate: string | null,
  paymentAmount: string | null,
  tasksList: string[] | null,
  isTasksListRequired: boolean,
}

export interface ICreatePlanTask {
  id: string,
  text: string,
}
