import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AwsCognitoService } from '../aws/aws.cognito.service';
import { AuthLoginDto } from './dtos/auth-login.dto';
import { AuthRegisterDto } from './dtos/auth-register.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private cognitoService: AwsCognitoService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  async signUp(@Body() authRegister: AuthRegisterDto) {
    return await this.cognitoService.signUp(authRegister);
  }

  @Post('signin')
  @UsePipes(ValidationPipe)
  async signIn(@Body() authLogin: AuthLoginDto) {
    return await this.cognitoService.signIn(authLogin);
  }
}
