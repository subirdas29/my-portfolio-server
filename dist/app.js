"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_rate_limit_2 = require("express-rate-limit");
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const app = (0, express_1.default)();
app.set('trust proxy', 1);
// Health check route — placed BEFORE all middleware (helmet, rate limiter,
// compression, json parser, cors, routers) so it returns instantly with
// zero DB/AI/token overhead. Used by Cron Job / UptimeRobot to ping
// every ~5 min to keep the Render Free Tier instance 'warm' and prevent
// the 15-minute sleep mode from triggering.
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'alive', timestamp: new Date() });
});
app.use((0, helmet_1.default)({
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
}));
const generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    store: new express_rate_limit_2.MemoryStore(),
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes',
    },
});
if (process.env.NODE_ENV === 'production') {
    app.use('/api', generalLimiter);
}
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: '10kb' }));
app.use((0, cookie_parser_1.default)());
const portfolioUrl = process.env.PORTFOLIO_URL || 'http://localhost:3000';
app.use((0, cors_1.default)({
    origin: [
        portfolioUrl,
        'https://subirdas.vercel.app',
        'https://my-portfolio-dashboard-six.vercel.app',
        'http://localhost:3000',
        'http://localhost:3001',
    ],
    credentials: true,
}));
app.use(express_1.default.static(path_1.default.join(process.cwd(), 'public')));
app.use('/api/v1', routes_1.default);
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: '😎 Portfolio server is secured and running with performance layers',
        uptime: process.uptime(),
    });
});
app.use(globalErrorHandler_1.default);
app.use(notFound_1.default);
exports.default = app;
