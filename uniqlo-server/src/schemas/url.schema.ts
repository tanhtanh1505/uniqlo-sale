import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UrlDocument = HydratedDocument<Url>;

@Schema()
export class Url {
  @Prop()
  person: string;

  @Prop()
  urls: string[];
}

export const UrlSchema = SchemaFactory.createForClass(Url);
