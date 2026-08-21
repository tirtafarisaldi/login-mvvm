export interface AuthObject {
  authenticatedUser: boolean;
  cognitoUser: any;
}

export class AuthValueObject {
  authenticatedUser;
  cognitoUser;

  constructor(auth: AuthObject) {
    this.authenticatedUser = auth.authenticatedUser;
    this.cognitoUser = auth.cognitoUser;
  }
}
