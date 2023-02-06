import {Prop,Schema,SchemaFactory, raw} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import { Category, Level } from '../../common/interfaces/category.enum';


export type EnrollmentDocument = Enrollment & Document;

@Schema()
export class Enrollment {

    @Prop()
    userId:string

    @Prop()
    courseId:string

    @Prop()
    proficiency:Level

    @Prop({default: new Date()})
    enrolledDate:Date
}


export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment)