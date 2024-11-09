import { registerAs } from '@nestjs/config';

export default registerAs('rmq', () => ({
  url: process.env.RMQ_URL,
}));
