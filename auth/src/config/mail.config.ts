import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  host: process.env.MAIL_HOST,
  port: +process.env.MAIL_PORT,
  auth: {
    password: process.env.MAIL_PASS,
    user: process.env.MAIL_USER,
  },
}));
