import { instanceToPlain } from "class-transformer";

export class CreateEventDto {


  toJSON() {
    return instanceToPlain(this);
  }
}