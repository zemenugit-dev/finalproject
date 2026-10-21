import { Request, Response } from 'express';
import {
  userIdSchema,
  userListQuerySchema,
  updateUserSchema,
} from './users.schema';
import * as usersService from './users.service';
import { UserNotFoundError } from './users.service';

export class UsersController {
  getAll = async (req: Request, res: Response): Promise<void> => {
    const validation = userListQuerySchema.safeParse(req.query);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid user list filters.',
        errors: validation.error.flatten(),
      });
      return;
    }

    try {
      const data = await usersService.getUsers(validation.data);

      res.status(200).json({
        success: true,
        count: data.length,
        data,
      });
    } catch (error) {
      this.handleError(res, error, 'Unable to retrieve users.');
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const validation = userIdSchema.safeParse(req.params.id);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid user ID.',
      });
      return;
    }

    try {
      const data = await usersService.getUserById(validation.data);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      this.handleError(res, error, 'Unable to retrieve user.');
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const idValidation = userIdSchema.safeParse(req.params.id);
    const bodyValidation = updateUserSchema.safeParse(req.body);

    if (!idValidation.success || !bodyValidation.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid user ID or update data.',
        errors: bodyValidation.success
          ? undefined
          : bodyValidation.error.flatten(),
      });
      return;
    }

    try {
      const data = await usersService.editUser(
        idValidation.data,
        bodyValidation.data,
      );

      res.status(200).json({
        success: true,
        message: 'User updated successfully.',
        data,
      });
    } catch (error) {
      this.handleError(res, error, 'Unable to update user.');
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const validation = userIdSchema.safeParse(req.params.id);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid user ID.',
      });
      return;
    }

    try {
      const data = await usersService.removeUser(validation.data);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully.',
        data,
      });
    } catch (error) {
      this.handleError(res, error, 'Unable to delete user.');
    }
  };

  private handleError(
    res: Response,
    error: unknown,
    message: string,
  ): void {
    if (error instanceof UserNotFoundError) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    const code =
      typeof error === 'object' &&
      error !== null &&
      'code' in error
        ? (error as { code?: string }).code
        : undefined;

    if (code === '23505') {
      res.status(409).json({
        success: false,
        message: 'The email or phone number is already in use.',
      });
      return;
    }

    if (code === '23503') {
      res.status(409).json({
        success: false,
        message: 'This user cannot be deleted because related records exist.',
      });
      return;
    }

    console.error(message, error);

    res.status(500).json({
      success: false,
      message,
    });
  }
}
