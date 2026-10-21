import * as repository from './users.repository';
import type {
  UserListQuery,
  UpdateUserInput,
} from './users.schema';

export class UserNotFoundError extends Error {
  constructor(id: number) {
    super(`User with ID ${id} was not found.`);
    this.name = 'UserNotFoundError';
  }
}

export async function getUsers(filters: UserListQuery) {
  return repository.findAllUsers(filters);
}

export async function getUserById(id: number) {
  const user = await repository.findUserById(id);

  if (!user) {
    throw new UserNotFoundError(id);
  }

  return user;
}

export async function editUser(
  id: number,
  input: UpdateUserInput,
) {
  const user = await repository.updateUser(id, input);

  if (!user) {
    throw new UserNotFoundError(id);
  }

  return user;
}

export async function removeUser(id: number) {
  const deleted = await repository.deleteUser(id);

  if (!deleted) {
    throw new UserNotFoundError(id);
  }

  return { user_id: id };
}
