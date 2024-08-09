import { availableUserRolesEnum } from './../constants';
import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Define an interface for the user document.
// You can change update user schema as per the need
interface User extends Document {
  name: string;
  email: string;
  phone: number;
  password: string;
  avatar?: {
    url: string;
    public_id: string;
    width: number;
    height: number;
  };
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  role: 'ADMIN' | 'TRAINER' | 'USER';
  allotedTrainer?: string;
  allotedShift?: string;
  isSubscriptionActive?: boolean;
  subscriptionStartDate: Date;
  subscriptionEndDate: Date;
  refreshToken: string;
  forgotPasswordToken: string;
  forgotPasswordTokenExpiration: Date;
  emailVerificationToken: string;
  emailVerificationTokenExpiration: Date;
}

// Define the user schema
const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: Number,
      required: [true, 'Phone number is required'],
      unique: true,
      minlength: 10,
      maxlength: 10,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    avatar: {
      type: {
        url: String,
        public_id: String,
        width: Number,
        height: Number,
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: availableUserRolesEnum,
      default: availableUserRolesEnum[0],
    },
    allotedTrainer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    allotedShift: {
      type: Schema.Types.ObjectId,
      ref: 'Shift',
    },
    isSubscriptionActive: {
      type: Boolean,
      default: false,
    },
    subscriptionStartDate: {
      type: Date,
    },
    subscriptionEndDate: {
      type: Date,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    forgotPasswordToken: {
      type: String,
      select: false,
    },
    forgotPasswordTokenExpiration: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationTokenExpiration: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Pre middlewares will be written here
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateTemporaryToken = function () {
  // This token should be client facing
  // for example: for email verification unHashedToken should go into the user's mail
  const unHashedToken = crypto.randomBytes(20).toString('hex');

  // This should stay in the DB to compare at the time of verification
  const hashedToken = crypto
    .createHash('sha256')
    .update(unHashedToken)
    .digest('hex');
  // This is the expiry time for the token (20 minutes)
  const tokenExpiry = Date.now() + process.env.USER_TEMPORARY_TOKEN_EXPIRY!;

  return { unHashedToken, hashedToken, tokenExpiry };
};

// Define and export the User model
const User: Model<User> = mongoose.model<User>('User', userSchema);
export default User;
