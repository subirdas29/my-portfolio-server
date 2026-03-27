import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { MemoryStore } from 'express-rate-limit';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();

app.set('trust proxy', 1);

// Health check route — placed BEFORE all middleware (helmet, rate limiter,
// compression, json parser, cors, routers) so it returns instantly with
// zero DB/AI/token overhead. Used by Cron Job / UptimeRobot to ping
// every ~5 min to keep the Render Free Tier instance 'warm' and prevent
// the 15-minute sleep mode from triggering.
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'alive', timestamp: new Date() });
});

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        imgSrc: [
          "'self'",
          'data:',
          'blob:',
          'https://res.cloudinary.com',
          '*.vercel.app',
        ],
        connectSrc: ["'self'", 'https://res.cloudinary.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: new MemoryStore(),
  message: {
    success: false,
    message:
      'Too many requests from this IP, please try again after 15 minutes',
  },
});

if (process.env.NODE_ENV === 'production') {
  app.use('/api', generalLimiter);
}

app.use(compression());

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

const portfolioUrl = process.env.PORTFOLIO_URL || 'http://localhost:3000';

app.use(
  cors({
    origin: [
      portfolioUrl,
      'https://subirdas-portfolio.vercel.app',
      'https://my-portfolio-dashboard-six.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
  }),
);

app.use(express.static(path.join(process.cwd(), 'public')));

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message:
      '😎 Portfolio server is secured and running with performance layers',
    uptime: process.uptime(),
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
