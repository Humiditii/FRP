import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './schema/course.schema';
import { Enrollment, EnrollmentSchema } from './schema/enrolled.schema';

@Module({
  controllers: [CourseController],
  providers: [CourseService],
  imports:[
    MongooseModule.forFeature([
      {name:Course.name, schema:CourseSchema},
      {name:Enrollment.name, schema:EnrollmentSchema}
    ])
  ]
})
export class CourseModule {}
