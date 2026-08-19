import { PromoCode } from '../models';

export class FinanceService {
  static async createPromoCode(body: any) {
    const { code, discount_percentage, discountPercentage, max_discount_amount, maxDiscountAmount, valid_vertical, validVertical } = body;
    const vertical = valid_vertical || validVertical;

    if (!['tours', 'fleet', 'all'].includes(vertical)) {
      const error: any = new Error("valid_vertical must be 'tours', 'fleet', or 'all'");
      error.statusCode = 400;
      throw error;
    }

    return PromoCode.create({
      code,
      discountPercentage: discount_percentage || discountPercentage,
      maxDiscountAmount: max_discount_amount || maxDiscountAmount || 0,
      validVertical: vertical,
      isActive: true,
    });
  }

  static async listPromoCodes() {
    return PromoCode.find();
  }

  static async validatePromoCode(code: string, vertical: string) {
    const promo = await PromoCode.findOne({ code, isActive: true });
    if (!promo) {
      const error: any = new Error('Invalid or expired promo code');
      error.statusCode = 404;
      throw error;
    }

    if (promo.validVertical !== 'all' && promo.validVertical !== vertical) {
      const error: any = new Error(
        `Promo code '${code}' is valid for ${promo.validVertical.toUpperCase()} only and cannot be applied to ${String(vertical).toUpperCase()}!`
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
