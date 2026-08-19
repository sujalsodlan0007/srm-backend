"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLead = void 0;
const zod_1 = require("zod");
const Lead_1 = require("../models/Lead");
const sanitize_1 = require("../utils/sanitize");
const email_service_1 = require("../services/email.service");
const leadSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, 'Name is required').max(120),
    company: zod_1.z.string().trim().min(1, 'Company is required').max(120),
    country: zod_1.z.string().trim().min(1, 'Country is required').max(120),
    email: zod_1.z.string().trim().email('Please enter a valid email'),
    phone: zod_1.z.string().trim().min(7, 'Please enter a valid phone number').max(20),
    productInterest: zod_1.z.string().trim().max(120).optional().or(zod_1.z.literal('')),
    quantityRequired: zod_1.z.string().trim().max(120).optional().or(zod_1.z.literal('')),
    message: zod_1.z.string().trim().max(2000).optional().or(zod_1.z.literal('')),
    firstName: zod_1.z.string().trim().max(120).optional().or(zod_1.z.literal('')),
    lastName: zod_1.z.string().trim().max(120).optional().or(zod_1.z.literal('')),
    fullName: zod_1.z.string().trim().max(160).optional().or(zod_1.z.literal('')),
    productType: zod_1.z.string().trim().max(120).optional().or(zod_1.z.literal('')),
    quantity: zod_1.z.string().trim().max(120).optional().or(zod_1.z.literal('')),
    estimatedBudget: zod_1.z.string().trim().max(120).optional().or(zod_1.z.literal('')),
    additionalDetails: zod_1.z.string().trim().max(2000).optional().or(zod_1.z.literal('')),
    source: zod_1.z.string().trim().max(80).optional(),
    honeypot: zod_1.z.string().max(0).optional()
});
const createLead = async (req, res, next) => {
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
            name: (0, sanitize_1.sanitizeText)(data.name || fallbackName),
            company: (0, sanitize_1.sanitizeText)(data.company),
            country: (0, sanitize_1.sanitizeText)(data.country),
            email: (0, sanitize_1.sanitizeText)(data.email).toLowerCase(),
            phone: (0, sanitize_1.sanitizeText)(data.phone),
            productInterest: (0, sanitize_1.sanitizeText)(data.productInterest),
            quantityRequired: (0, sanitize_1.sanitizeText)(data.quantityRequired),
            message: (0, sanitize_1.sanitizeText)(data.message || data.additionalDetails),
            firstName: (0, sanitize_1.sanitizeText)(data.firstName),
            lastName: (0, sanitize_1.sanitizeText)(data.lastName),
            fullName: (0, sanitize_1.sanitizeText)(data.fullName || fallbackName),
            productType: (0, sanitize_1.sanitizeText)(data.productType),
            quantity: (0, sanitize_1.sanitizeText)(data.quantity),
            estimatedBudget: (0, sanitize_1.sanitizeText)(data.estimatedBudget),
            additionalDetails: (0, sanitize_1.sanitizeText)(data.additionalDetails || data.message),
            source: (0, sanitize_1.sanitizeText)(data.source)
        };
        if (sanitizedData.honeypot && sanitizedData.honeypot.length > 0) {
            return res.status(400).json({ success: false, message: 'Spam detected' });
        }
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentLead = await Lead_1.Lead.findOne({
            email: sanitizedData.email,
            createdAt: { $gte: twentyFourHoursAgo }
        }).sort({ createdAt: -1 });
        const lead = await Lead_1.Lead.create({
            ...sanitizedData,
            source: sanitizedData.source || 'contact-form',
            isDuplicate: Boolean(recentLead),
            status: 'new'
        });
        await (0, email_service_1.sendLeadEmails)({
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
    }
    catch (error) {
        next(error);
    }
};
exports.createLead = createLead;
