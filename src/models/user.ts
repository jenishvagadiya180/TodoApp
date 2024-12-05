import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  isActive: boolean;
  isDeleted: boolean;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    }  ,
    isDeleted: {
      type: Boolean,
      default: false, 
    }
  },
 
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);
