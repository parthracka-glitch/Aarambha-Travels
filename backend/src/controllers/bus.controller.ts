import { Request, Response, NextFunction } from 'express';
import * as BusService from '../services/bus.service';
import { sendSuccess, sendError } from '../helpers/response.helper';

export class BusController {
  static async listBuses(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const buses = await BusService.getAllBuses();
      sendSuccess(res, buses, 200, 'Rental buses & rate cards retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  static async getBusById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bus = await BusService.getBusById(req.params.id);
      if (!bus) {
        sendError(res, 'Rental bus listing not found', 404);
        return;
      }
      sendSuccess(res, bus, 200, 'Rental bus retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async createBus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bus = await BusService.createBus(req.body);
      sendSuccess(res, bus, 201, 'New bus rental listing created successfully');
    } catch (err) {
      next(err);
    }
  }

  static async updateBus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bus = await BusService.updateBusRate(req.params.id, req.body);
      if (!bus) {
        sendError(res, 'Rental bus listing not found', 404);
        return;
      }
      sendSuccess(res, bus, 200, 'Bus rental rates updated successfully');
    } catch (err) {
      next(err);
    }
  }

  static async deleteBus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const success = await BusService.deleteBus(req.params.id);
      if (!success) {
        sendError(res, 'Rental bus listing not found', 404);
        return;
      }
      sendSuccess(res, { id: req.params.id }, 200, 'Bus rental listing removed successfully');
    } catch (err) {
      next(err);
    }
  }
}
