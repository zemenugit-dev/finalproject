import * as repository from './orders.repository';
import type {
  OrderListQuery,
  CreateOrderInput,
  UpdateOrderInput,
} from './orders.schema';

export class OrderNotFoundError extends Error {
  constructor(id: number) {
    super(`Order with ID ${id} was not found.`);
    this.name = 'OrderNotFoundError';
  }
}

export async function getOrders(filters: OrderListQuery) {
  return repository.findAll(filters);
}

export async function getOrderById(id: number) {
  const order = await repository.findById(id);

  if (!order) {
    throw new OrderNotFoundError(id);
  }

  return order;
}

export async function createOrder(input: CreateOrderInput) {
  return repository.create(input);
}

export async function updateOrder(
  id: number,
  input: UpdateOrderInput,
) {
  const order = await repository.update(id, input);

  if (!order) {
    throw new OrderNotFoundError(id);
  }

  return order;
}

export async function deleteOrder(id: number) {
  const deleted = await repository.remove(id);

  if (!deleted) {
    throw new OrderNotFoundError(id);
  }

  return { order_id: id };
}
