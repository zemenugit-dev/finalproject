
import { Router } from 'express';
import { RoutesController } from './routes.controller';

const router = Router();
const routesController = new RoutesController();

// Create a delivery route
router.post('/', routesController.create);

// Get all delivery routes (supports filtering and pagination)
router.get('/', routesController.findAll);

// Get a delivery route by ID
router.get('/:routeId', routesController.findById);

// Update a delivery route
router.patch('/:routeId', routesController.update);

// Delete a delivery route
router.delete('/:routeId', routesController.delete);

export default router;
