import redisClient from "./redis";

export class CacheUtils {

  static async clearCache(patterns: string[]): Promise<void> {
    try {
      if (!redisClient.isOpen) {
        console.warn('⚠️ Redis connection is closed. Skipping cache clear.');
        return;
      }

      const allKeys: string[] = [];

      for (const pattern of patterns) {
      
        let cursor = '0'; 
        
        do {
          const reply = await redisClient.scan(cursor, {
            MATCH: pattern,
            COUNT: 100,
          });

        
          cursor = reply.cursor;
          
          if (reply.keys.length > 0) {
            allKeys.push(...reply.keys);
          }
          

        } while (cursor !== '0'); 
      }

      if (allKeys.length > 0) {
        const uniqueKeys = [...new Set(allKeys)];
        await redisClient.del(uniqueKeys);
        console.log(`🧹 Cache Purged: ${uniqueKeys.length} items for patterns [${patterns}]`);
      }
    } catch (error) {
      console.error('❌ Redis Cache Clear Error:', error);
    }
  }
}