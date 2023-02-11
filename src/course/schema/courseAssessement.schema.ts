import {Prop,Schema,SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import { QuestionAnswerStruct } from '../dto/course.dto';


export type CourseAssessementDocument = CourseAssessement & Document;

@Schema()
export class CourseAssessement {

    @Prop()
    courseId:string

    @Prop()
    qandA:QuestionAnswerStruct[]

    @Prop({default: new Date()})
    createdAt:Date
}


export const CourseAssessementSchema = SchemaFactory.createForClass(CourseAssessement)