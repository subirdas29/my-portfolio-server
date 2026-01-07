import { createClient } from 'redis';
import config from '../config'; 
const redisClient = createClient({
  url: config.redis_url, 
  socket: {
    tls: true, 
    rejectUnauthorized: false
  }
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error', err);
});

redisClient.on('connect', () => {
  console.log('✅ Redis Connected Successfully');
});


if (!redisClient.isOpen) {
    redisClient.connect().catch(console.error);
}

export default redisClient;