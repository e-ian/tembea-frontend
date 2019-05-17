export interface IProviderInventory {
    id?: number;
    name: string;
    providerUserId: string;
    user: IUser;
}
export interface IUser {
    id?: number;
    name: string;
    phoneNo: number;
    email: string;
}
