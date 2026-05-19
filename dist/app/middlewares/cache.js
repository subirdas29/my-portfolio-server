"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cache_1 = __importDefault(require("node-cache"));
const config_1 = __importDefault(require("../config"));
const nodeCache = new node_cache_1.default({ stdTTL: config_1.default.cache_time });
const cache = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.default = cache;
