import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit'; 
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();

app.set('trust proxy', 1);


app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "blob:", "https://res.cloudinary.com"], 
      connectSrc: ["'self'", "https://res.cloudinary.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" } 
}));

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, 
  standardHeaders: true, 
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

if (process.env.NODE_ENV === 'production') {
  app.use('/api', generalLimiter);
}

app.use(compression());


app.use(express.json({ limit: '5mb' })); 
app.use(cookieParser());


app.use(
  cors({
    origin: [
      'https://subirdas-portfolio.vercel.app',
      'https://my-portfolio-dashboard-six.vercel.app',
      'http://localhost:3000', 
      'http://localhost:3001' 
    ],
    credentials: true,
  }),
);

app.use(express.static(path.join(process.cwd(), 'public')));

app.use('/api/v1', router); 

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '😎 Portfolio server is secured and running with performance layers',
    uptime: process.uptime(),
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;