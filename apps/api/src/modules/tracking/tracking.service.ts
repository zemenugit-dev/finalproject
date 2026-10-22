
import { TrackingRepository } from './tracking.repository';
import {
  CreateTrackingLogInput,
  TrackingLog,
  TrackedOrder
} from './tracking.schema';

export class TrackingService {
  private readonly repository: TrackingRepository;

  constructor() {
    this.repository = new TrackingRepository();
  }

  async addTrackingUpdate(
    input: CreateTrackingLogInput
  ): Promise<TrackingLog> {
    const order = await this.repository.findOrderById(
      input.orderId
    );

    if (!order) {
      throw new Error('ORDER_NOT_FOUND');
    }

    return this.repository.createTrackingLog(input);
  }

  async getTrackingHistory(
    orderId: number
  ): Promise<{
    order: TrackedOrder;
    trackingHistory: TrackingLog[];
  }> {
    const order = await this.repository.findOrderById(
      orderId
    );

    if (!order) {
      throw new Error('ORDER_NOT_FOUND');
    }

    const trackingHistory =
      await this.repository.findTrackingHistory(orderId);

    return {
      order,
      trackingHistory
    };
  }
}
