"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const public_routes_1 = __importDefault(require("./routes/public.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const content_routes_1 = __importDefault(require("./routes/content.routes"));
const errorHandler_middleware_1 = require("./middleware/errorHandler.middleware");
exports.app = (0, express_1.default)();
exports.app.use((0, helmet_1.default)());
const allowedDevOrigins = [
    env_1.env.FRONTEND_URL,
    'https://srmglobalhub.com',
    'https://www.srmglobalhub.com',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
].filter(Boolean);
exports.app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow non-browser requests (e.g., curl, server-to-server)
        if (!origin)
            return callback(null, true);
        if (allowedDevOrigins.includes(origin))
            return callback(null, true);
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
}));
exports.app.use(express_1.default.json({ limit: '10mb' }));
exports.app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'SRM Global Hub backend is running',
        endpoints: ['/health', '/api/leads', '/api/admin/login']
    });
});
exports.app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
exports.app.use('/api', public_routes_1.default);
exports.app.use('/api', admin_routes_1.default);
exports.app.use('/api', content_routes_1.default);
exports.app.use(errorHandler_middleware_1.errorHandler);
const startServer = async () => {
    await (0, db_1.connectDatabase)();
    const tryListen = (port) => {
        const server = exports.app.listen(port, () => {
            const address = server.address();
            const actualPort = typeof address === 'object' && address ? address.port : port;
            console.log(`Server running on http://localhost:${actualPort}`);
        });
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE' && port !== 0) {
                console.warn(`Port ${port} is busy; trying an available port...`);
                tryListen(0);
                return;
            }
            console.error('Server failed to start', error);
        });
    };
    tryListen(env_1.env.PORT);
};
exports.startServer = startServer;
if (require.main === module) {
    (0, exports.startServer)();
}
