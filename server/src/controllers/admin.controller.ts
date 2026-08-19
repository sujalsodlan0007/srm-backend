import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin';
import { Lead } from '../models/Lead';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { env } from '../config/env';

export const loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    let admin = await Admin.findOne({ email });
    if (!admin) {
      const defaultEmail = 'sujalsodlan0001@gmail.com';
      const defaultPassword = 'sachin@2001';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      admin = await Admin.create({
        email: defaultEmail,
        passwordHash: hashedPassword,
        role: 'owner'
      });
    }

    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id.toString(), email: admin.email, role: admin.role }, env.JWT_SECRET || 'dev-secret', { expiresIn: '24h' });
    return res.status(200).json({ success: true, token, admin: { email: admin.email, role: admin.role } });
  } catch (error) {
    next(error);
  }
};

export const listLeads = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, leads });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = req.body as { status?: string; notes?: string };
    const lead = await Lead.findByIdAndUpdate(id, updates, { new: true });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    return res.status(200).json({ success: true, lead });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    return res.status(200).json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    next(error);
  }
};
