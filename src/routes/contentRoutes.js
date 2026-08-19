const express = require('express');
const router = express.Router();

router.get('/blogposts', (_req, res) => {
  res.json({ success: true, posts: [] });
});

router.get('/gallery', (_req, res) => {
  res.json({ success: true, items: [] });
});

router.get('/testimonials', (_req, res) => {
  res.json({ success: true, items: [] });
});

module.exports = router;
