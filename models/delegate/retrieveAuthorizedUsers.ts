export type AuthorizedUser = {
  uuid: string;
  nameFirst: string;
  nameLast: string;
  email: string;
};

export type RetrieveAuthorizedUsersRequest = {
  userUuid: string;
};
