import { Request, Response } from 'express';
import {
  orderIdSchema,
  orderListQuerySchema,
  createOrderSchema,
  updateOrderSchema,
} from './orders.schema';
import * as ordersService from './orders.service';
import { OrderNotFoundError } from './orders.service';

export class OrdersController {
  getAll = async (req: Request, res: Response): Promise<void> => {
    const validation = orderListQuerySchema.safeParse(req.query);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid order filters.',
        errors: validation.error.flatten(),
      });
      return;
    }

    try {
      const data = await ordersService.getOrders(validation.data);

      res.status(200).json({
        success: true,
        count: data.length,
        data,
      });
    } catch (error) {
      this.handleError(res, error, 'Unable to retrieve orders.');
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const validation = orderIdSchema.safeParse(req.params.id);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid order ID.',
      });
      return;
    }

    try {
      const data = await ordersService.getOrderById(validation.data);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      this.handleError(res, error, 'Unable to retrieve order.');
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const validation = createOrderSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid order data.',
        errors: validation.error.flatten(),
      });
      return;
    }

    try {
      const data = await ordersService.createOrder(validation.data);

      res.status(201).json({
        success: true,
        message: 'Order created successfully.',
        data,
      });
    } catch (error) {
      this.handleError(res, error, 'Unable to create order.');
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const idValidation = orderIdSchema.safeParse(req.params.id);
    const bodyValidation = updateOrderSchema.safeParse(req.body);

    if (!idValidation.success || !bodyValidation.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid order ID or update data.',
        errors: bodyValidation.success
          ? undefined
          : bodyValidation.error.flatten(),
      });
      return;
    }

    try {
      const data = await ordersService.updateOrder(
        idValidation.data,
        bodyValidation.data,
      );

      res.status(200).json({
        success: true,
        message: 'Order updated successfully.',
        data,
      });
    } catch (error) {
      this.handleError(res, error, 'Unable to update order.');
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const validation = orderIdSchema.safeParse(req.params.id);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid order ID.',
      });
      return;
    }

    try {
      const data = await ordersService.deleteOrder(validation.data);

      res.status(200).json({
        success: true,
        message: 'Order deleted successfully.',
        data,
      });
    } catch (error) {
      this.handleError(res, error, 'Unable to delete order.');
    }
  };

  private handleError(
    res: Response,
    error: unknown,
    message: string,
  ): void {
    if (error instanceof OrderNotFoundError) {
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

    if (code === '23503') {
      res.status(409).json({
        success: false,
        message:
          'A referenced buyer or product does not exist, or related records prevent this operation.',
      });
      return;
    }

    if (code === '23505') {
      res.status(409).json({
        success: false,
        message: 'The order conflicts with an existing record.',
      });
      return;
    }

    if (code === '23514' || code === '22P02' || code === '22003') {
      res.status(400).json({
        success: false,
        message: 'The order data violates a database constraint.',
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
