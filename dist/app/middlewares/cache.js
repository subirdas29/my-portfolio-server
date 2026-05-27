"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cache_1 = __importDefault(require("node-cache"));
const config_1 = __importDefault(require("../config"));
const nodeCache = new node_cache_1.default({ stdTTL: config_1.default.cache_time });
const cache = async (req, res, next) => {
    if (req.method !== 'GET') {
        next();
        return;
    }
    const key = req.originalUrl;
    try {
        const cachedData = nodeCache.get(key);
        if (cachedData) {
            console.log('🚀 Serving from Cache => ', key);
            res.status(200).json(cachedData);
            return;
        }
        console.log('📝 Caching process started for => ', key);
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                nodeCache.set(key, body);
            }
            return originalJson(body);
        };
        next();
    }
    catch (err) {
        console.error('⚠️ Cache Middleware Error:', err);
        next();
    }
};
exports.default = cache;
//# sourceMappingURL=cache.js.map