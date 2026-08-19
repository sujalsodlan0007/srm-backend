"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const env_1 = require("./env");
let mongoMemoryServer = null;
const isPlaceholderMongoUri = (uri) => {
    try {
        const parsed = new URL(uri);
        return parsed.hostname === 'cluster0.mongodb.net';
    }
    catch {
        return false;
    }
};
const connectDatabase = async () => {
    if (mongoose_1.default.connection.readyState >= 1) {
        return;
    }
    try {
        if (env_1.env.MONGODB_URI) {
            if (isPlaceholderMongoUri(env_1.env.MONGODB_URI)) {
                console.warn('MONGODB_URI uses the placeholder host cluster0.mongodb.net. Add your full MongoDB Atlas URI to backend/.env to use a persistent database.');
            }
            else {
                await mongoose_1.default.connect(env_1.env.MONGODB_URI);
                console.log('MongoDB connected');
                return;
            }
        }
    }
    catch (error) {
        console.warn('Primary MongoDB connection failed. Falling back to in-memory database for this local run.', error);
    }
    if (!mongoMemoryServer) {
        mongoMemoryServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    }
    const uri = mongoMemoryServer.getUri();
    await mongoose_1.default.connect(uri);
    console.log('MongoDB connected to in-memory server');
};
exports.connectDatabase = connectDatabase;
