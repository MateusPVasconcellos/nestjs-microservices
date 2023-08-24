import { UserRefreshToken } from 'src/auth/domain/entities/user-refresh-token.entity';
import { UserAddress } from './userAddress.entity';
import { UserDetail } from './userDetail.entity';
import { UserRole } from './userRole.entity';

export class User {
  readonly id?: string;
  readonly password?: string;
  readonly email?: string;
  readonly active?: boolean;
  readonly role_id?: string;

  readonly userDetail?: UserDetail;
  readonly userAddress?: UserAddress;
  readonly userRefreshToken?: UserRefreshToken;
  readonly userRole?: UserRole;
}
