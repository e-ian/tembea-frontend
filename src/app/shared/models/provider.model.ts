export interface IProviderUser {
  name: string;
  email: string;
  slackId: string;
  phoneNo?: string;
}

export interface IProviderInventory {
  id?: number;
  name?: string;
  email?: string;
  providerUserId?: number;
  user?: IProviderUser;
}

export class ProviderModel implements IProviderInventory {
  constructor(
    public name?: string,
    public email?: string,
    public isDirectMessage?: boolean,
    public channelId?: string,
  ) { }
}
