export class ActivateEmailEvent {
  constructor(
    readonly email?: string,
    readonly name?: string,
    readonly token?: string,
  ) {}
}
