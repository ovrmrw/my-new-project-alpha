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

export interface ITranslation {
  text: string;
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
  translated?: string;
}
