import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { patchUser } from 'api/user/patchUser';
import { UserPostRequest } from 'models/user/user';

type PatchUserOptions = UseMutationOptions<
  unknown,
  unknown,
  UserPostRequest,
  unknown
>;

export const usePatchUser = (options?: PatchUserOptions) =>
  useMutation<unknown, unknown, UserPostRequest, unknown>(patchUser, options);
