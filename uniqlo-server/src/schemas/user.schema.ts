import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/utils/roles/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  displayName: string;

  @Prop()
  remainingMail: number;

  @Prop()
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
