import { Exclude, instanceToPlain } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SigninDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 50)
  @Exclude({ toPlainOnly: true })
  password: string;

  toJSON() {
    return instanceToPlain(this);
  }
}
