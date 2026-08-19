"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const getEnv = (key, fallback = '') => {
    const value = process.env[key] ?? fallback;
    return typeof value === 'string' ? value : fallback;
};
const mongoUri = getEnv('MONGODB_URI') || getEnv('mongoURI');
exports.env = {
    NODE_ENV: getEnv('NODE_ENV', 'development'),
    PORT: Number(getEnv('PORT', '5000')),
    MONGODB_URI: mongoUri,
    JWT_SECRET: getEnv('JWT_SECRET', 'dev-secret'),
    EMAIL_USER: getEnv('EMAIL_USER'),
    EMAIL_PASS: getEnv('EMAIL_PASS'),
    OWNER_NOTIFICATION_EMAIL: getEnv('OWNER_NOTIFICATION_EMAIL', 'sujalsodlan0001@gmail.com'),
    // Owner/admin contact email default
    // Updated to the project owner's Gmail
    OWNER_CONTACT_EMAIL: getEnv('OWNER_CONTACT_EMAIL', 'sujalsodlan0001@gmail.com'),
    FRONTEND_URL: getEnv('FRONTEND_URL', 'http://localhost:5173')
};
