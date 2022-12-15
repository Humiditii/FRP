import { Module } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Assessment, AssessmentSchema } from './schema/assessment.schema';
import { Question, QuestionSchema } from './schema/questions.schema';

@Module({
  controllers: [AssessmentController],
  providers: [AssessmentService],
  imports:[
    MongooseModule.forFeature([
      {name:Assessment.name, schema:AssessmentSchema},
      {name:Question.name, schema: QuestionSchema}
    ]),
  ]
})
export class AssessmentModule {}
