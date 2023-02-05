import { HttpException, Injectable } from '@nestjs/common';
import { CreateCourseDto, EnrollmentDto } from './dto/course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from './schema/course.schema';
import { Model } from 'mongoose';
import { Enrollment, EnrollmentDocument } from './schema/enrolled.schema';
import { Category, Level } from 'src/common/interfaces/category.enum';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel:Model<CourseDocument>,
    @InjectModel(Enrollment.name) private enrollmentModel:Model<EnrollmentDocument>
  ){}

  private readonly ISE: string = 'Internal server error';

  async uploadCourse(createCourseDto:CreateCourseDto):Promise<any>{
    try {

      for (const iterator in Level) {
       if(!createCourseDto.courseContent?.[iterator]){
        createCourseDto.courseContent[iterator] = {} 
  
        createCourseDto.courseContent[iterator as unknown as Level].dateAdded = new Date()
       }
       else{
        createCourseDto.courseContent[iterator as unknown as Level].dateAdded = new Date()
       }
      
      }
    
      return await this.courseModel.create(createCourseDto)
    } catch (error) {
      throw new HttpException(error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500) 
    }
  }

  async viewCourses(learningStyle:Category):Promise<any>{
    try {
      return await this.courseModel.find({category:learningStyle}).lean()
    } catch (error) {
      throw new HttpException(error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500) 
    }
  }

  async enroll(enrollmentDto:EnrollmentDto):Promise<any>{
    try {
      return await this.enrollmentModel.create(enrollmentDto)
    } catch (error) {
      throw new HttpException(error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500) 
    }
  }

  async viewEnrolledCourses(userId:string):Promise<any>{
    try {
      return (await this.enrollmentModel.find({ userId:userId })).map( async (enroll_x:Enrollment) => {
        return {
          ...enroll_x,
          courseName: (await this.courseModel.findById(enroll_x.courseId)).courseName
        }
      })
    } catch (error) {
      throw new HttpException(error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500) 
    }
  }

  async deleteCourse(deleteDto: Omit<EnrollmentDto, 'proficiency'>):Promise<void>{
    try {
      await this.enrollmentModel.findOneAndDelete({deleteDto})
    } catch (error) {
      throw new HttpException(error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500) 
    }
  }
}
