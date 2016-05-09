export class Translation {
  text: string;
  clientId: string;
  clientSecret: string;
  accessToken: string;
  translated: string;
}

export class Credential {
  ClientId: string;
  ClientSecret: string;
}

export class AddState {
  constructor(
    public data: any,
    public functionOrClass: Function = null
  ) { }
}