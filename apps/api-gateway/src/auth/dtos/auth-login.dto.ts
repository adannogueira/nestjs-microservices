import { IsEmail, Matches } from 'class-validator';

const PASSWORD_REQUIREMENT_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export class AuthLoginDto {
  @IsEmail()
  email: string;

  @Matches(PASSWORD_REQUIREMENT_REGEX, {
    message: 'invalid password',
  })
  pass: string;
}
