import { Schema, model, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';

export interface IUser {
  email: string;
  password: string;
  role: string;
}

export interface IUserModel extends Model<IUser> {
  isUserExist(email: string): Promise<IUser & { _id: any }>;
  isThePasswordMatched(plainTextPassword: string, hashPassword: string): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(passwordChangedTimestamp: Date, jwtIssuedTimestamp: number): boolean;
}

const userSchema = new Schema<IUser, IUserModel>(
  {
    email: { type: String, required: true, unique: true, immutable: true, trim: true },
    password: { type: String, required: true, select: 0 },
    role: { type: String, default: 'admin' },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds));
  next();
});

userSchema.post('save', async function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExist = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

userSchema.statics.isThePasswordMatched = async function (
  plainTextPassword: string,
  hashPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<IUser, IUserModel>('User', userSchema);
