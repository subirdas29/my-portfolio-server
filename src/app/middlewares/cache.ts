import { NextFunction, Request, Response } from 'express';
import NodeCache from 'node-cache';
import config from '../config';

const nodeCache = new NodeCache({ stdTTL: config.cache_time });

const cache = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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

    res.json = (body: unknown): Response => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        nodeCache.set(key, body);
      }
      return originalJson(body);
    };

    next();
  } catch (err) {
    console.error('⚠️ Cache Middleware Error:', err);
    next();
  }
};

export default cache;
