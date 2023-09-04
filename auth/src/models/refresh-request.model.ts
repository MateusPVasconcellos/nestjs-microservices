export class RefreshRequest extends Request {
  user: User;
}

export class User {
  readonly id: string;
  readonly email: string;
}
