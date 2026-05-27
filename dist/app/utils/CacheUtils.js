"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheUtils = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const config_1 = __importDefault(require("../config"));
const nodeCache = new node_cache_1.default({ stdTTL: config_1.default.cache_time });
class CacheUtils {
    static clearCache(patterns) {
        const keys = nodeCache.keys();
        const keysToDelete = keys.filter((key) => patterns.some((pattern) => key.includes(pattern)));
        if (keysToDelete.length > 0) {
            nodeCache.del(keysToDelete);
            console.log(`🧹 Cache Purged: ${keysToDelete.length} items for patterns [${patterns}]`);
        }
    }
}
exports.CacheUtils = CacheUtils;
//# sourceMappingURL=CacheUtils.js.map