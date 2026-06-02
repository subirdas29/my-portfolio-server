/* eslint-disable @typescript-eslint/no-explicit-any */
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html, replyTo }: { to?: string; subject: string; html: string; replyTo?: string }) => {
  try {
    const data = await resend.emails.send({
      from: 'Subir Portfolio <onboarding@resend.dev>',
      to: [process.env.MY_PERSONAL_EMAIL as string],
      replyTo: replyTo || to,
      subject: to ? `[To: ${to}] ${subject}` : subject,
      html: html,
    });
    console.log('Resend Response:', data);
    return [data, null];
  } catch (error) {
    console.error('Resend Error:', error);
    return [null, error];
  }
};

export const sendEmailTo = async ({ to, subject, html }: { to: string | string[]; subject: string; html: string }) => {
  try {
    const data = await resend.emails.send({
      from: 'Subir Das <onboarding@resend.dev>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });
    return [data, null];
  } catch (error) {
    console.error('Resend Error:', error);
    return [null, error];
  }
};

export default sendEmail;
