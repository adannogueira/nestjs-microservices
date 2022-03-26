// We have a different way to connect to mongoose, joining the schema
// and interface in a single class, this way:

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';

// The decorator defines the class as an Schema for mongoose
@Schema({ timestamps: true, collection: 'rankings' })
export class Ranking extends Document {
  // The props are the fields description
  @Prop({ type: mongooseSchema.Types.ObjectId })
  challenge: string;

  @Prop({ type: mongooseSchema.Types.ObjectId })
  player: string;

  @Prop({ type: mongooseSchema.Types.ObjectId })
  match: string;

  @Prop({ type: mongooseSchema.Types.ObjectId })
  category: string;

  // since the type is already declared as string, no need to repeat in the prop
  @Prop()
  event: string;

  @Prop()
  operation: string;

  @Prop()
  points: number;
}

// For the class to effectively act as an schema, we feed it into an schema factory
export const RankingSchema = SchemaFactory.createForClass(Ranking);
