import { Router } from 'express';
import { UsersController } from './users.controller';

const router = Router();
const usersController = new UsersController();

// GET /api/users
router.get('/', usersController.getAll);

// GET /api/users/:id
router.get('/:id', usersController.getById);

// PATCH /api/users/:id
router.patch('/:id', usersController.update);

// DELETE /api/users/:id
router.delete('/:id', usersController.delete);

export default router;
