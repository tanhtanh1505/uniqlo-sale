import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type FavoriteDocument = HydratedDocument<Favorite>;

@Schema()
export class Favorite {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  code: string;

  @Prop()
  size: string;

  @Prop()
  color: string;

  @Prop()
  price: number;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
