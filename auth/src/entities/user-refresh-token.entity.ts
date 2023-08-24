import { User } from './user.entity';

export class UserRefreshToken {
  id?: string;
  jti_refresh_token?: string;
  user_id?: string;
  user?: User;
}
