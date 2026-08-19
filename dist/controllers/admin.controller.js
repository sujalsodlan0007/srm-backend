"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLead = exports.updateLead = exports.listLeads = exports.loginAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = require("../models/Admin");
const Lead_1 = require("../models/Lead");
const env_1 = require("../config/env");
const loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }
        let admin = await Admin_1.Admin.findOne({ email });
        if (!admin) {
            const defaultEmail = 'sujalsodlan0001@gmail.com';
            const defaultPassword = 'sachin@2001';
            const hashedPassword = await bcryptjs_1.default.hash(defaultPassword, 10);
            admin = await Admin_1.Admin.create({
                email: defaultEmail,
                passwordHash: hashedPassword,
                role: 'owner'
            });
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, admin.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: admin._id.toString(), email: admin.email, role: admin.role }, env_1.env.JWT_SECRET || 'dev-secret', { expiresIn: '24h' });
        return res.status(200).json({ success: true, token, admin: { email: admin.email, role: admin.role } });
    }
    catch (error) {
        next(error);
    }
};
exports.loginAdmin = loginAdmin;
const listLeads = async (_req, res, next) => {
    try {
        const leads = await Lead_1.Lead.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, leads });
    }
    catch (error) {
        next(error);
    }
};
exports.listLeads = listLeads;
const updateLead = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const lead = await Lead_1.Lead.findByIdAndUpdate(id, updates, { new: true });
        if (!lead) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }
        return res.status(200).json({ success: true, lead });
    }
    catch (error) {
        next(error);
    }
};
exports.updateLead = updateLead;
const deleteLead = async (req, res, next) => {
    try {
        const { id } = req.params;
        const lead = await Lead_1.Lead.findByIdAndDelete(id);
        if (!lead) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }
        return res.status(200).json({ success: true, message: 'Lead deleted' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteLead = deleteLead;
