import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AuthLoginDto } from '../auth/dtos/auth-login.dto';
import { AuthRegisterDto } from '../auth/dtos/auth-register.dto';

@Injectable()
export class AwsCognitoService {
  private userPool: CognitoUserPool;

  constructor() {
    // To use the cognito service we first need to get an instance using the credentials
    // received upon creation
    this.userPool = new CognitoUserPool({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      ClientId: process.env.COGNITO_CLIENT_ID,
    });
  }

  async signUp(authRegister: AuthRegisterDto) {
    const { name, email, pass, phoneNumber } = authRegister;

    return new Promise((resolve, reject) => {
      // To execute a new user signUp, we send the user/pass data
      this.userPool.signUp(
        email,
        pass,
        // along with the additional data defined when we setup the cognito, for this, we
        // must send an intance of the attribute data
        [
          new CognitoUserAttribute({
            // The attribute name follows the same name on cognito config page
            Name: 'phone_number',
            Value: phoneNumber,
          }),
          // An instance is needed for each attribute
          new CognitoUserAttribute({
            Name: 'name',
            Value: name,
          }),
        ],
        null,
        (err, result) => {
          if (!result) reject(err);
          resolve(result.user);
        },
      );
    });
  }

  async signIn(authLogin: AuthLoginDto) {
    const { email, pass } = authLogin;
    const userData = {
      Username: email,
      Pool: this.userPool,
    };
    const authenticationDetais = new AuthenticationDetails({
      Username: email,
      Password: pass,
    });

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetais, {
        onSuccess: (result) => resolve(result),
        onFailure: (err) => reject(err),
      });
    });
  }
}
