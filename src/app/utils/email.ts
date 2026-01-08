/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL as string,
    pass: process.env.ZOHO_EMAIL_PASS as string,
  },
});

interface TEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const sendEmail = async ({ to, subject, text, html }: TEmailOptions): Promise<[any, any]> => {
  let response: [any, any] = [null, null];
  try {
    const mailOptions = {
      from: `${process.env.APP_NAME || 'Portfolio'} <${process.env.ZOHO_EMAIL}>`,
      to,
      subject: subject || 'New Message',
      text,
      ...(html && { html }),
    };

    const info = await transporter.sendMail(mailOptions);
    response = [info, null];
  } catch (error) {
    console.error('Email Error:', error);
    response = [null, error];
  }
  return response;
};

export default sendEmail;