/* eslint-disable @typescript-eslint/no-explicit-any */
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY as string);


interface TEmailOptions {
  subject: string;
  html: string;
}


const sendEmail = async ({ subject, html }: TEmailOptions): Promise<[any, any]> => {
  try {
    const data = await resend.emails.send({
      from: 'Subir Portfolio <onboarding@resend.dev>', 
      to: [process.env.MY_PERSONAL_EMAIL as string], 
      subject: subject,
      html: html,
    });
    console.log('Resend Response:', data);
    return [data, null];
  } catch (error) {
    console.error('Resend Error:', error);
    return [null, error];
  }
};

export default sendEmail;