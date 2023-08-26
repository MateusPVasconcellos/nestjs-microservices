import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessPublicKey: process.env.JWT_PUBLIC_KEY,
  accessPrivateKey: process.env.JWT_PRIVATE_KEY,
  refreshPublicKey: process.env.JWT_REFRESH_PUBLIC_KEY,
  refreshPrivateKey: process.env.JWT_REFRESH_PRIVATE_KEY,
  activatePublicKey: process.env.JWT_ACTIVATE_PUBLIC_KEY,
  activatePrivateKey: process.env.JWT_ACTIVATE_PRIVATE_KEY,
  refreshExpiresIn: +process.env.JWT_REFRESH_EXPIRES_IN,
  activateExpiresIn: +process.env.JWT_ACTIVATE_EXPIRES_IN,
  accessExpiresIn: +process.env.JWT_EXPIRES_IN,
  recoveryExpiresIn: +process.env.JWT_RECOVERY_EXPIRES_IN,
  saltRounds: +process.env.JWT_SALT_ROUNDS,
}));
