import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Category, Level } from '../../common/interfaces/category.enum';
import { CourseCont } from 'src/common/interfaces/interfaces';

export type CourseDocument = Course & Document;

@Schema()
export class Course {
  @Prop({ required: true })
  category: Category;

  @Prop({ required: true })
  courseName: string;

  @Prop()
  courseImage: string;

  @Prop(
    raw({
      [Level.Beginner]: {
        type: Array<{ content: String; dateAdded: Date }>,
        required: false,
      },
      [Level.Intermediate]: {
        type: Array<{ content: String; dateAdded: Date }>,
        required: false,
      },
      [Level.Expert]: {
        type: Array<{ content: String; dateAdded: Date }>,
        required: false,
      },
    }),
  )
  courseContent: Record<Level, CourseCont>;

  @Prop({ default: new Date() })
  createdAt: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
