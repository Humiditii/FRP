import {Prop,Schema,SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import { Category } from '../../common/interfaces/category.enum';


export type AssessmentDocument = Assessment & Document;

@Schema()
export class Assessment {
    
    @Prop({required:true})
    user_id:string

    @Prop({required:true})
    category:Category

    @Prop({default:new Date()})
    createdAt:Date

}


export const AssessmentSchema = SchemaFactory.createForClass(Assessment)