import { IsEmail, IsMobilePhone, IsString, Matches } from 'class-validator';

const PASSWORD_REQUIREMENT_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export class AuthRegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @Matches(PASSWORD_REQUIREMENT_REGEX, {
    message: 'invalid password',
  })
  pass: string;

  @IsMobilePhone('pt-BR')
  phoneNumber: string;
}
