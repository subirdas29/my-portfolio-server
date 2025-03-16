import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production', // true for port 465, false for other ports
    auth: {
      user: 'subirdas1045@gmail.com',
      pass: 'xdyv oeeb runl krje',
    },
  });

  await transporter.sendMail({
    from: 'subirdas1045@gmail.com', // sender address
    to, // list of receivers
    subject: 'Reset your password within 10min ✔', // Subject line
    text: '', // plain text body
    html, // html body
  });
};
