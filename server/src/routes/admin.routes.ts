import { Router } from 'express';
import { deleteLead, listLeads, loginAdmin, updateLead } from '../controllers/admin.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/admin/login', loginAdmin);
router.get('/admin/leads', authMiddleware, listLeads);
router.patch('/admin/leads/:id', authMiddleware, updateLead);
router.delete('/admin/leads/:id', authMiddleware, deleteLead);

export default router;
