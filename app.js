// Main entry point for cPanel / LiteSpeed / Node hosting environments
const { app, startServer } = require('./dist/server');

if (require.main === module) {
  startServer();
}

module.exports = app;
