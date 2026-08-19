const express = require('express');
const router = express.Router();

const leads = [];

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (email === 'sujalsodlan0001@gmail.com' && password === 'sachin@2001') {
    return res.status(200).json({
      success: true,
      token: 'demo-admin-token',
      admin: { email, role: 'owner' }
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

router.get('/leads', (_req, res) => {
  res.status(200).json({ success: true, leads });
});

router.patch('/leads/:id', (req, res) => {
  const { id } = req.params;
  const lead = leads.find((item) => item.id === id);

  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }

  Object.assign(lead, req.body || {});
  return res.status(200).json({ success: true, lead });
});

router.delete('/leads/:id', (req, res) => {
  const { id } = req.params;
  const index = leads.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }

  leads.splice(index, 1);
  return res.status(200).json({ success: true, message: 'Lead deleted' });
});

module.exports = router;
