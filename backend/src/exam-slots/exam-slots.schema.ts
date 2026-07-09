import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExamSlotDocument = HydratedDocument<ExamSlot>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class ExamSlot {
  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true, min: 1, default: 10 })
  capacity: number;

  @Prop({ required: true, min: 0, default: 0 })
  bookedCount: number;

  createdAt: Date;
}

export const ExamSlotSchema = SchemaFactory.createForClass(ExamSlot);

ExamSlotSchema.virtual('isFull').get(function (this: ExamSlotDocument) {
  return this.bookedCount >= this.capacity;
});
