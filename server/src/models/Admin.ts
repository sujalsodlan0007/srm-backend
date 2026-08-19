import { Document, model, Schema } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  passwordHash: string;
  role: 'owner' | 'admin';
  createdAt: Date;
}

const adminSchema = new Schema<IAdmin>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['owner', 'admin'], default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

export const Admin = model<IAdmin>('Admin', adminSchema);
