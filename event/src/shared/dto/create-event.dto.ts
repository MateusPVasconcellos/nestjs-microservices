import { instanceToPlain } from "class-transformer";
import { IsDate, IsNotEmpty, MaxLength, ValidateNested } from "class-validator";

export class EventJob {
  event_id?: string;
  description?: string;
  name?: string;
  payment_hour?: any;

  eventCandidate?: EventCandidate;
  eventCollaborator?: EventCollaborator;
}

export class EventAddress {
  cep?: string;
  uf?: string;
  address?: string;
  city?: string;
  number?: string;
  district?: string;
  event_id?: string;
}

export class EventCandidate {
  user_id?: string;
  job_id?: string;
}

export class EventCollaborator {
  user_id?: string
  job_id?: string
}

export class CreateEventDto {
  @IsNotEmpty()
  @IsDate()
  time?: Date;

  @IsNotEmpty()
  @MaxLength(500)
  description?: string;

  @IsNotEmpty()
  user_id?: string;

  @ValidateNested()
  eventAddress?: EventAddress;

  toJSON() {
    return instanceToPlain(this);
  }
}
