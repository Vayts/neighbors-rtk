export const NEIGHBORHOOD_VALIDATION = {
  minName: 4,
  maxName: 30,
  minDescription: 2,
  maxDescription: 400,
};

export const REGISTER_VALIDATION = {
  minFirstName: 2,
  maxFirstName: 25,
  minLastName: 2,
  maxLastName: 20,
  minLogin: 5,
  maxLogin: 20,
  minPassword: 8,
  maxPassword: 25,
};

export const DEBT_VALIDATION = {
  minAmount: 1,
  maxAmount: 9999999,
  minText: 1,
  maxText: 120,
  minPayment: 0.01,
};

export const PLAN_VALIDATION = {
  minParticipantsLength: 1,
  minTasksLength: 1,
  minName: 3,
  maxName: 25,
  minDescription: 5,
  maxDescription: 200,
  minAmount: 0.01,
  maxAmount: 9999999,
  minTask: 3,
  maxTask: 100,
};

export const DUTY_VALIDATIONS = {
  minName: 2,
  maxName: 25,
  minParticipantsLength: 1,
};
