import {Prop,Schema,SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import { Options } from '../dto/create-assessment.dto';


export type QuestionDocument = Question & Document;

@Schema()
export class Question {
    
    @Prop({required:true, type:{que:String, options:Object}})
    entry: {que:string, options:Options}

    @Prop({default:new Date()})
    createdAt:Date

}


export const QuestionSchema = SchemaFactory.createForClass(Question)