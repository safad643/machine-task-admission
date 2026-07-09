import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum UserRole {
  PARENT = 'PARENT',
  ADMISSION_TEAM = 'ADMISSION_TEAM',
}

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
})
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    enum: UserRole,
    default: UserRole.PARENT,
  })
  role: UserRole;

  @Prop({ required: true, trim: true })
  name: string;

  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
