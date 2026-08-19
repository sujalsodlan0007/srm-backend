import { Document, model, Schema } from 'mongoose';

export type LeadStatus = 'new' | 'contacted' | 'in-progress' | 'closed';

export interface ILead extends Document {
  name: string;
  company: string;
  country: string;
  email: string;
  phone: string;
  productInterest?: string;
  quantityRequired?: string;
  message?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  productType?: string;
  quantity?: string;
  estimatedBudget?: string;
  additionalDetails?: string;
  status: LeadStatus;
  notes?: string;
  source: string;
  isDuplicate: boolean;
  createdAt: Date;
}

const leadSchema = new Schema<ILead>({
  name: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  productInterest: { type: String, trim: true },
  quantityRequired: { type: String, trim: true },
  message: { type: String, trim: true },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  fullName: { type: String, trim: true },
  productType: { type: String, trim: true },
  quantity: { type: String, trim: true },
  estimatedBudget: { type: String, trim: true },
  additionalDetails: { type: String, trim: true },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in-progress', 'closed'],
    default: 'new'
  },
  notes: { type: String, trim: true },
  source: { type: String, default: 'contact-form' },
  isDuplicate: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Lead = model<ILead>('Lead', leadSchema);
