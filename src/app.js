const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/healthRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contentRoutes = require('./routes/contentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running' });
});

app.use('/api/health', healthRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', contentRoutes);

module.exports = app;
