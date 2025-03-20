import { model, Schema } from 'mongoose';

import bcrypt from 'bcrypt';
import config from '../../config';
import { TLoginUser, UserModel } from './auth.interface';

const userSchema = new Schema<TLoginUser, UserModel>({
 
  email: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: 0,
  },

  role: { type: String, default:'admin' },

},
{
  timestamps: true,
},
);

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
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
  plainTextPassword,
  hashPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};


export const User = model<TLoginUser, UserModel>('User', userSchema);
