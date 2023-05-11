import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SizeColor } from 'src/entity';

export type ClothDocument = HydratedDocument<Cloth>;

@Schema()
export class Cloth {
  @Prop()
  person: string;

  @Prop()
  title: string;

  @Prop()
  time: string;

  @Prop()
  price: number;

  @Prop()
  salePrice: number;

  @Prop()
  sizeColor: Array<SizeColor>;

  @Prop()
  url: string;

  @Prop()
  image: string;

  @Prop()
  code: string;
}

export const ClothSchema = SchemaFactory.createForClass(Cloth);
