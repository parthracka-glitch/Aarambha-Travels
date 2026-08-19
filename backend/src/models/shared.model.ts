import mongoose, { Schema, Document } from 'mongoose';

// ─── AdminUser ─────────────────────────────────────────
export interface IAdminUser extends Document {
  name: string;
  email: string;
  hashedPassword: string;
  role: 'superadmin' | 'viewer';
  roleId?: string;
  isActive: boolean;
  createdAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  hashedPassword: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'viewer'], default: 'viewer' },
  roleId: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const AdminUser = mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);

// ─── Role ──────────────────────────────────────────────
export interface IRole extends Document {
  name: string;
  description?: string;
  permissions: string[];
}

const RoleSchema = new Schema<IRole>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  permissions: [{ type: String }],
});

export const Role = mongoose.model<IRole>('Role', RoleSchema);

// ─── AuditLog ──────────────────────────────────────────
export interface IAuditLog extends Document {
  actorId?: string;
  actorName: string;
  action: string;
  targetType: string;
  targetId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  actorId: { type: String },
  actorName: { type: String, required: true, default: 'System' },
  action: { type: String, required: true },
  targetType: { type: String, required: true },
  targetId: { type: String },
  details: { type: Schema.Types.Mixed, default: {} },
  ipAddress: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

// ─── Setting ───────────────────────────────────────────
export interface ISetting extends Document {
  key: string;
  value: any;
  category: string;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
  category: { type: String, default: 'general' },
  updatedAt: { type: Date, default: Date.now },
});

export const Setting = mongoose.model<ISetting>('Setting', SettingSchema);

// ─── CMSContent ────────────────────────────────────────
export interface ICMSContent extends Document {
  sectionKey: string;
  title: string;
  content: Record<string, any>;
  updatedAt: Date;
}

const CMSContentSchema = new Schema<ICMSContent>({
  sectionKey: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export const CMSContent = mongoose.model<ICMSContent>('CMSContent', CMSContentSchema);

// ─── BlogPost ──────────────────────────────────────────
export interface IBlogPost extends Document {
  slug: string;
  title: string;
  summary?: string;
  content: string;
  coverImage?: string;
  author: string;
  isPublished: boolean;
  createdAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  summary: { type: String },
  content: { type: String, required: true },
  coverImage: { type: String },
  author: { type: String, default: 'Aarambha Team' },
  isPublished: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const BlogPost = mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

// ─── PromoCode ─────────────────────────────────────────
export interface IPromoCode extends Document {
  code: string;
  discountPercentage: number;
  maxDiscountAmount: number;
  validVertical: 'tours' | 'fleet' | 'all';
  isActive: boolean;
  createdAt: Date;
}

const PromoCodeSchema = new Schema<IPromoCode>({
  code: { type: String, required: true, unique: true, index: true },
  discountPercentage: { type: Number, required: true },
  maxDiscountAmount: { type: Number, default: 0 },
  validVertical: { type: String, enum: ['tours', 'fleet', 'all'], required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const PromoCode = mongoose.model<IPromoCode>('PromoCode', PromoCodeSchema);
