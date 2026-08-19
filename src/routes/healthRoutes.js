const express = require('express');
const router = express.Router();
9
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'backend'
  });
});

module.exports = router;
