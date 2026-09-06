import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { connectDatabase } from './config/db';
import publicRoutes from './routes/public.routes';
import adminRoutes from './routes/admin.routes';
import contentRoutes from './routes/content.routes';
import { errorHandler } from './middleware/errorHandler.middleware';

export const app = express();

app.use(helmet());
const allowedDevOrigins = [
  env.FRONTEND_URL,
  'https://srmglobalhub.com',
  'https://www.srmglobalhub.com',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g., curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedDevOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
  })
);
app.use(express.json({ limit: '10mb' }));

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'SRM Global Hub backend is running',
    endpoints: ['/health', '/api/leads', '/api/admin/login']
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', publicRoutes);
app.use('/api', adminRoutes);
app.use('/api', contentRoutes);

app.use(errorHandler);

export const startServer = async () => {
  await connectDatabase();

  const tryListen = (port: number) => {
    const server = app.listen(port, () => {
      const address = server.address();
      const actualPort = typeof address === 'object' && address ? address.port : port;
      console.log(`Server running on http://localhost:${actualPort}`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE' && port !== 0) {
        console.warn(`Port ${port} is busy; trying an available port...`);
        tryListen(0);
        return;
      }

      console.error('Server failed to start', error);
    });
  };

  tryListen(env.PORT);
};

if (require.main === module) {
  startServer();
}
