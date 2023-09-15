export class GenerateRecoveryTokenEvent {
  constructor(
    readonly email?: string,
    readonly name?: string,
    readonly user_id?: string,
  ) {}
}
