import { instanceToPlain } from 'class-transformer';
import { IsEmail, IsNotEmpty, Length, MaxLength } from 'class-validator';
import { Match } from '../decorators/match.decorator';

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @Length(5, 50)
  password: string;

  @Match('password')
  password_confirmation: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string;

  cpf_cnpj: string;

  type_person: string;

  toJSON() {
    return instanceToPlain(this);
  }
}
