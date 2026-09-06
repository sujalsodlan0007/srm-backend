// Re-export full compiled Express app with all routes (/api/leads, /health, etc.)
const { app } = require('../dist/server');

module.exports = app;

