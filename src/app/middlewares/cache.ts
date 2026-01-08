/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import redisClient from "../utils/redis";


const cache = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  if (!redisClient.isOpen) {
    console.error('⚠️ Redis client is closed. Skipping cache.');
    next();
    return;
  }


  if (req.method !== 'GET') {
    next();
    return;
  }

  const key = req.originalUrl;

  try {
  
    const cachedData = await redisClient.get(key);
    
    if (cachedData) {
      console.log('🚀 Serving from Cache => ', key);
      res.status(200).json(JSON.parse(cachedData));
      return; 
    }

    console.log('📝 Caching process started for => ', key);


    const originalJson = res.json.bind(res);

   
    res.json = (body: any): Response => {
   
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const cacheTime = parseInt(process.env.REDIS_CACHE_TIME || '3600');
        
        redisClient.setEx(key, cacheTime, JSON.stringify(body)).catch(err => {
          console.error('❌ Redis SetEx Error:', err);
        });
      }
      
      return originalJson(body);
    };

    next();
  } catch (err) {
    console.error('⚠️ Redis Middleware Error:', err);
    next();
  }
};

export default cache;