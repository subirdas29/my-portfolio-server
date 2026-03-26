import dotenv from 'dotenv';
import path from 'path';
import { Resend } from 'resend';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  admin_password: process.env.ADMIN_PASSWORD,
  resend: new Resend(process.env.RESEND_API_KEY),
  cache_time: parseInt(process.env.CACHE_TIME || '3600'),
  gemini_api_key: process.env.GEMINI_API_KEY,
  pinecone_api_key: process.env.PINECONE_API_KEY,
  pinecone_index: process.env.PINECONE_INDEX,
  portfolio_url: process.env.PORTFOLIO_URL,
  openrouter_api_key: process.env.OPENROUTER_API_KEY,
};
