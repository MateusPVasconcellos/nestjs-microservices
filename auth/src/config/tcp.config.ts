import { registerAs } from "@nestjs/config";

export default registerAs('tcp', () => ({
    authServicePort: +process.env.AUTH_SERVICE_TCP_PORT,
    authServiceHost: process.env.AUTH_SERVICE_TCP_HOST,
  }));