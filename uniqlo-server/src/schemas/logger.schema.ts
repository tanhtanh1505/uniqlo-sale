import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LoggerType } from 'src/utils/enums';

export type LoggerDocument = HydratedDocument<Logger>;

@Schema({ timestamps: true })
export class Logger {
  @Prop()
  type: LoggerType;

  @Prop()
  content: string;
}

export const LoggerSchema = SchemaFactory.createForClass(Logger);
