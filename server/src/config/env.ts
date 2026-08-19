import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const getEnv = (key: string, fallback = ''): string => {
  const value = process.env[key] ?? fallback;
  return typeof value === 'string' ? value : fallback;
};

const mongoUri = getEnv('MONGODB_URI') || getEnv('mongoURI');

export const env = {
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
