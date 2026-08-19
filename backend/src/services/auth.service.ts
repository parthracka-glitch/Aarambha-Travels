import { AdminUser } from '../models';
import { comparePassword, createToken, recordAudit } from '../middlewares/auth.middleware';

export class AuthService {
  static async login(email: string, password: string, ipAddress?: string) {
    const admin = await AdminUser.findOne({ email });

    if (!admin || !(await comparePassword(password, admin.hashedPassword))) {
      const error: any = new Error('Incorrect email or password');
      error.statusCode = 401;
      throw error;
    }

    if (!admin.isActive) {
      const error: any = new Error('Account disabled');
      error.statusCode = 403;
      throw error;
    }

    const token = createToken({ sub: admin._id, email: admin.email, name: admin.name, role: admin.role });

    await recordAudit({
      actorName: admin.name,
      action: 'LOGIN_SUCCESS',
      targetType: 'admin_user',
      targetId: String(admin._id),
      ipAddress,
    });

    return { token, admin };
  }

  static async getMe(adminId: string) {
    const admin = await AdminUser.findById(adminId).select('-hashedPassword');
    if (!admin) {
      const error: any = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return admin;
  }
}
