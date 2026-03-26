import NodeCache from 'node-cache';
import config from '../config';

const nodeCache = new NodeCache({ stdTTL: config.cache_time });

export class CacheUtils {
  static clearCache(patterns: string[]): void {
    const keys = nodeCache.keys();
    const keysToDelete = keys.filter((key) =>
      patterns.some((pattern) => key.includes(pattern)),
    );

    if (keysToDelete.length > 0) {
      nodeCache.del(keysToDelete);
      console.log(
        `🧹 Cache Purged: ${keysToDelete.length} items for patterns [${patterns}]`,
      );
    }
  }
}
