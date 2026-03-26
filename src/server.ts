import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import seedAdmin from './app/DB';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('✅ MongoDB Connected Successfully');

    await seedAdmin();

    server = app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port}`);
    });
  } catch (err) {
    console.error('💥 Critical Startup Error:', err);
    process.exit(1);
  }
}

main();

process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('😈 Uncaught Exception detected! Shutting down safely...', err);
  process.exit(1);
});

const gracefulShutdown = async (signal: string) => {
  console.log(`\n🛑 ${signal} received. Cleaning up...`);

  if (server) {
    server.close(() => {
      mongoose.connection.close(false).then(() => {
        process.exit(0);
      });
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
