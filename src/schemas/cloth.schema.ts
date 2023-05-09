import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ClothDocument = HydratedDocument<Cloth>;

@Schema()
export class Cloth {
  @Prop()
  person: string;

  @Prop()
  title: string;

  @Prop()
  price: string;

  @Prop()
  salePrice: string;

  @Prop()
  time: string;

  @Prop()
  sizeColor: Array<string>;

  @Prop()
  url: string;

  @Prop()
  image: string;
}

export const ClothSchema = SchemaFactory.createForClass(Cloth);
