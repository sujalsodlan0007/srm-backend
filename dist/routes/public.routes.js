"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leads_controller_1 = require("../controllers/leads.controller");
const rateLimit_middleware_1 = require("../middleware/rateLimit.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const leadInputSchema = zod_1.z.object({
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
router.post('/leads', rateLimit_middleware_1.leadRateLimiter, (0, validate_middleware_1.validateBody)(leadInputSchema), leads_controller_1.createLead);
exports.default = router;
