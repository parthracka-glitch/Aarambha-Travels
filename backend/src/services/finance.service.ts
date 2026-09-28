import { PromoCode } from '../models';

export class FinanceService {
  static async createPromoCode(body: any) {
    const rawCode = body.code || body.promo_code || body.promoCode;
    const cleanCode = String(rawCode || '').toUpperCase().trim();
    if (!cleanCode) {
      const error: any = new Error('Promo code is required and cannot be blank');
      error.statusCode = 400;
      throw error;
    }

    const { discount_percentage, discountPercentage, max_discount_amount, maxDiscountAmount, valid_vertical, validVertical } = body;
    const rawVertical = (valid_vertical || validVertical || 'all').toString().toLowerCase().trim();
    const vertical = ['tours', 'fleet', 'all'].includes(rawVertical) ? (rawVertical as 'tours' | 'fleet' | 'all') : 'all';

    // Remove any old broken empty entry or existing duplicate
    await PromoCode.deleteMany({ $or: [{ code: cleanCode }, { code: '' }] });

    return PromoCode.create({
      code: cleanCode,
      discountPercentage: Number(discount_percentage || discountPercentage || 10),
      maxDiscountAmount: Number(max_discount_amount || maxDiscountAmount || 0),
      validVertical: vertical,
      isActive: true,
      createdAt: new Date(),
    });
  }

  static async listPromoCodes() {
    return PromoCode.find().sort({ createdAt: -1 });
  }

  static async validatePromoCode(code: string, vertical: string) {
    const cleanCode = String(code || '').toUpperCase().trim();
    const cleanVertical = String(vertical || 'all').toLowerCase().trim();

    const promo = await PromoCode.findOne({ code: cleanCode, isActive: true });
    if (!promo) {
      const error: any = new Error('Invalid or expired promo code');
      error.statusCode = 404;
      throw error;
    }

    if (promo.validVertical !== 'all' && promo.validVertical !== cleanVertical) {
      const error: any = new Error(
        `Promo code '${cleanCode}' is valid for ${promo.validVertical.toUpperCase()} only and cannot be applied to ${cleanVertical.toUpperCase()}!`
      );
      error.statusCode = 400;
      throw error;
    }

    return {
      valid: true,
      code: promo.code,
      discount_percentage: promo.discountPercentage,
      max_discount_amount: promo.maxDiscountAmount,
      valid_vertical: promo.validVertical,
    };
  }
}

