import { Model } from "mongoose";

export type TLoginUser = {
  email: string;
  password: string;
  role?:'admin' | 'user'
};


export interface UserModel extends Model<TLoginUser> {
  isThePasswordMatched(
    plainTextPassword: string,
    hashPassword: string,
  ): Promise<boolean>;
  isUserExist(email: string): Promise<TLoginUser>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
