import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Lead } from '../models/Lead';
import { sanitizeText } from '../utils/sanitize';
import { sendLeadEmails } from '../services/email.service';

const leadSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  company: z.string().trim().min(1, 'Company is required').max(120),
  country: z.string().trim().min(1, 'Country is required').max(120),
  email: z.string().trim().email('Please enter a valid email'),
  phone: z.string().trim().min(7, 'Please enter a valid phone number').max(20),
  productInterest: z.string().trim().max(120).optional().or(z.literal('')),
  quantityRequired: z.string().trim().max(120).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  firstName: z.string().trim().max(120).optional().or(z.literal('')),
  lastName: z.string().trim().max(120).optional().or(z.literal('')),
  fullName: z.string().trim().max(160).optional().or(z.literal('')),
  productType: z.string().trim().max(120).optional().or(z.literal('')),
  quantity: z.string().trim().max(120).optional().or(z.literal('')),
  estimatedBudget: z.string().trim().max(120).optional().or(z.literal('')),
  additionalDetails: z.string().trim().max(2000).optional().or(z.literal('')),
  source: z.string().trim().max(80).optional(),
  honeypot: z.string().max(0).optional()
});

export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = leadSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message }))
      });
    }

    const data = parsed.data;

    const fallbackName = [data.firstName, data.lastName, data.fullName].filter(Boolean).join(' ').trim();
    const sanitizedData = {
      ...data,
      name: sanitizeText(data.name || fallbackName),
      company: sanitizeText(data.company),
      country: sanitizeText(data.country),
      email: sanitizeText(data.email).toLowerCase(),
      phone: sanitizeText(data.phone),
      productInterest: sanitizeText(data.productInterest),
      quantityRequired: sanitizeText(data.quantityRequired),
      message: sanitizeText(data.message || data.additionalDetails),
      firstName: sanitizeText(data.firstName),
      lastName: sanitizeText(data.lastName),
      fullName: sanitizeText(data.fullName || fallbackName),
      productType: sanitizeText(data.productType),
      quantity: sanitizeText(data.quantity),
      estimatedBudget: sanitizeText(data.estimatedBudget),
      additionalDetails: sanitizeText(data.additionalDetails || data.message),
      source: sanitizeText(data.source)
    };

    if (sanitizedData.honeypot && sanitizedData.honeypot.length > 0) {
      return res.status(400).json({ success: false, message: 'Spam detected' });
    }

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentLead = await Lead.findOne({
      email: sanitizedData.email,
      createdAt: { $gte: twentyFourHoursAgo }
    }).sort({ createdAt: -1 });

    const lead = await Lead.create({
      ...sanitizedData,
      source: sanitizedData.source || 'contact-form',
      isDuplicate: Boolean(recentLead),
      status: 'new'
    });

    await sendLeadEmails({
      name: lead.name,
      company: lead.company,
      country: lead.country,
      email: lead.email,
      phone: lead.phone,
      productInterest: lead.productInterest,
      quantityRequired: lead.quantityRequired,
      message: lead.message,
      leadId: lead._id.toString()
    });

    return res.status(201).json({ success: true, leadId: lead._id.toString() });
  } catch (error) {
    next(error);
  }
};
