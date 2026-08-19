import { Request, Response, NextFunction } from 'express';
import { FinanceService } from '../services/finance.service';

export class FinanceController {
  static async createPromoCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const promo = await FinanceService.createPromoCode(req.body);
      res.status(201).json(promo);
    } catch (err) {
      next(err);
    }
  }

  static async listPromoCodes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const list = await FinanceService.listPromoCodes();
      res.json(list);
    } catch (err) {
      next(err);
    }
  }

  static async validatePromoCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const code = req.body.code || req.query.code;
      const vertical = req.body.vertical || req.query.vertical;
      const result = await FinanceService.validatePromoCode(String(code), String(vertical));
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
