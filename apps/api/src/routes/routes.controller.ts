
import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { RoutesService } from './routes.service';
import {
  createRouteSchema,
  updateRouteSchema,
  routeIdSchema,
  listRoutesSchema
} from './routes.schema';

const routesService = new RoutesService();

export class RoutesController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createRouteSchema.parse({ body: req.body });
      const route = await routesService.create(validated.body);

      return res.status(201).json({
        success: true,
        message: 'Delivery route created successfully',
        data: route
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.issues
        });
      }
      return next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = listRoutesSchema.parse({ query: req.query });
      const result = await routesService.findAll(filters.query);

      return res.status(200).json({
        success: true,
        count: result.data.length,
        total: result.total,
        page: filters.query.page,
        limit: filters.query.limit,
        data: result.data
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid query parameters',
          errors: error.issues
        });
      }
      return next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = routeIdSchema.parse({
        params: req.params
      });

      const route = await routesService.findById(
        validated.params.routeId
      );

      if (!route) {
        return res.status(404).json({
          success: false,
          message: 'Delivery route not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: route
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid route ID',
          errors: error.issues
        });
      }
      return next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = updateRouteSchema.parse({
        params: req.params,
        body: req.body
      });

      const route = await routesService.update(
        validated.params.routeId,
        validated.body
      );

      if (!route) {
        return res.status(404).json({
          success: false,
          message: 'Delivery route not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Delivery route updated successfully',
        data: route
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.issues
        });
      }
      return next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = routeIdSchema.parse({
        params: req.params
      });

      const deleted = await routesService.delete(
        validated.params.routeId
      );

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Delivery route not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Delivery route deleted successfully'
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid route ID',
          errors: error.issues
        });
      }
      return next(error);
    }
  }
}
