export const AUTH_ROUTES = {
  register: '/auth/register',
  login: '/auth/login',
  refresh: '/auth/refresh',
  logout: '/auth/logout',
};

export const USER_ROUTES = {
  editProfile: '/user/edit-profile',
  changePassword: '/user/change-password',
};

export const NEIGHBORHOOD_ROUTES = {
  create: '/neighborhood/create',
  getByCode: '/neighborhood/get-by-code',
  joinByCode: '/neighborhood/join-by-code',
  getUserNeighborhoods: '/neighborhood/get-user-neighborhoods',
  getCurrent: '/neighborhood/get-current',
  setFavorite: '/neighborhood/set-favorite',
  removeFavorite: '/neighborhood/remove-favorite',
  removeUser: '/neighborhood/remove-user',
  generateInviteCode: '/neighborhood/generate-invite-code',
  removeInviteCode: '/neighborhood/remove-invite-code',
};

export const DEBTS_ROUTES = {
  create: '/debt/create',
  get: '/debt/get',
  getById: '/debt/get-by-id',
  edit: '/debt/edit',
  delete: '/debt/delete',
  addPayment: '/debt/add-payment',
  closeDebt: '/debt/close-debt',
};

export const PLAN_ROUTES = {
  create: '/plan/create',
  get: '/plan/get',
  getById: '/plan/get-by-id',
  edit: '/plan/edit',
  changeTaskStatus: '/plan/change-task-status',
  addPayment: '/plan/add-payment',
  closePlan: '/plan/close-plan',
  reopenPlan: '/plan/reopen-plan',
  deletePlan: '/plan/delete',
};

export const CHAT_ROUTES = {
  updateSeenBy: '/chat/update-viewed-message',
  loadMoreMessages: '/chat/load-more-messages',
};
