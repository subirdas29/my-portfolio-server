import Queue from 'bull';
import sendEmail from '../utils/sendEmail';

interface IEmailJob {
  subject: string;
  html: string;
}


const redisUrl = process.env.REDIS_URL as string;
const emailQueue = new Queue<IEmailJob>('email', redisUrl, {
  redis: {
    tls: { rejectUnauthorized: false }
  }
});


emailQueue.process(async (job) => {

  const { subject, html } = job.data;
  
  try {

    const [resp, err] = await sendEmail({ subject, html });
    
    if (err) throw err;
    
    console.log(`[QUEUE] Email job ${job.id} completed successfully`);
    return resp;
  } catch (error) {
    console.error(`Job ${job.id} failed:`, error);
    throw error;
  }
});

export default emailQueue;