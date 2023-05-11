import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { postUser } from 'api/user/postUser';
import { UserPostRequest, UserPostResponse } from 'models/user/user';

type PostUserOptions = UseMutationOptions<
  UserPostResponse,
  unknown,
  UserPostRequest,
  unknown
>;

export const usePostUser = (options?: PostUserOptions) =>
  useMutation<UserPostResponse, unknown, UserPostRequest, unknown>(
    postUser,
    options
  );
