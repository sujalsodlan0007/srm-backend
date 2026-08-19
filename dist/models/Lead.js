"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lead = void 0;
const mongoose_1 = require("mongoose");
const leadSchema = new mongoose_1.Schema({
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
exports.Lead = (0, mongoose_1.model)('Lead', leadSchema);
