export class RecoveryEmailEvent {
  constructor(
    readonly email?: string,
    readonly name?: string,
    readonly hash?: string,
  ) {}
}
