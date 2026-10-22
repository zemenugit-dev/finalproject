
import {
  createRoute,
  findAllRoutes,
  findRouteById,
  updateRoute,
  deleteRoute
} from './routes.repository';

import type {
  CreateRouteInput,
  UpdateRouteInput,
  ListRoutesQuery
} from './routes.schema';

export class RoutesService {
  async create(input: CreateRouteInput) {
    return createRoute(input);
  }

  async findAll(filters: ListRoutesQuery) {
    return findAllRoutes(filters);
  }

  async findById(routeId: number) {
    return findRouteById(routeId);
  }

  async update(routeId: number, input: UpdateRouteInput) {
    return updateRoute(routeId, input);
  }

  async delete(routeId: number) {
    return deleteRoute(routeId);
  }
}
