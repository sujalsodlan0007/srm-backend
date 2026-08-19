import { Router } from 'express';
import { createLead } from '../controllers/leads.controller';
import { leadRateLimiter } from '../middleware/rateLimit.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const leadInputSchema = z.object({
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

router.post('/leads', leadRateLimiter, validateBody(leadInputSchema), createLead);

export default router;
