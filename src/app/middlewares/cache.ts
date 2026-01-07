import { NextFunction, Request, Response } from "express";
import redisClient from "../utils/redis";

interface CustomResponse extends Response {
  sendResponse?: (body: any) => Response;
}

const cache = async (req: Request, res: CustomResponse, next: NextFunction) => {
  if (!redisClient.isOpen) {
    console.error('Redis client is closed. Skipping cache.');
    return next();
  }

  const key = req.originalUrl;

  try {
    const data = await redisClient.get(key);
    if (data) {
      console.log('From Cache => ', key);
      return res.json(JSON.parse(data));
    }

    console.log('Caching => ', key);

  
    res.sendResponse = res.json.bind(res);

    res.json = (body: any): Response => {
 
      const cacheTime = parseInt(process.env.REDIS_CACHE_TIME || '3600');
      redisClient.setEx(key, cacheTime, JSON.stringify(body));
      
  
      return res.sendResponse!(body);
    };

    next();
  } catch (err) {
    console.error('Redis Error:', err);
    next();
  }
};

export default cache;