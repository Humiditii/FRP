import { HttpException, Injectable } from '@nestjs/common';
import { CoursAssessementSubmitDto, CourseAssessementDto, CreateCourseDto, EnrollmentDto } from './dto/course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from './schema/course.schema';
import { Model } from 'mongoose';
import { Enrollment, EnrollmentDocument } from './schema/enrolled.schema';
import { Category, Level } from 'src/common/interfaces/category.enum';
import { CourseAssessement, CourseAssessementDocument } from './schema/courseAssessement.schema';
import { Err } from 'src/common/interfaces/interfaces';
import { uuid } from 'uuidv4';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel:Model<CourseDocument>,
    @InjectModel(Enrollment.name) private enrollmentModel:Model<EnrollmentDocument>,
    @InjectModel(CourseAssessement.name) private courseAssessementModel:Model<CourseAssessementDocument>
  ){}

  private readonly ISE: string = 'Internal server error';

  async uploadCourse(createCourseDto:CreateCourseDto):Promise<any>{
    try {

      for (const iterator in Level) {
       if(!createCourseDto.courseContent?.[iterator]){

        createCourseDto.courseContent[iterator] = [{}]
        for (const courseContX of createCourseDto.courseContent[iterator]) { 
          courseContX.dateAdded = new Date()
        }
        
       }
       else{
        for (const courseContX of createCourseDto.courseContent[iterator as unknown as Level]) {
         courseContX.dateAdded = new Date()
        }
       }
      
      }
    
      return await this.courseModel.create(createCourseDto)
    } catch (error) {
      throw new HttpException(error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500) 
    }
  }

  async viewCourses(learningStyle:Category):Promise<Course[]>{
    try {
      return await this.courseModel.find({category:learningStyle}).lean()
    } catch (error) {
      throw new HttpException(error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500) 
    }
  }

  async enroll(enrollmentDto:EnrollmentDto):Promise<Enrollment>{
    try {
      return await this.enrollmentModel.create(enrollmentDto)
    } catch (error) {
      throw new HttpException(error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500) 
    }
  }

  async viewEnrolledCourses(userId:string):Promise<any>{
    try {
      
      const enrollmentData = await this.enrollmentModel.find({ userId:userId }).lean()

      return await Promise.all(enrollmentData.map( async (enroll_x:Enrollment) => {
        return {
          ...enroll_x,
          courseName: (await this.courseModel.findById(enroll_x.courseId)).courseName
        }
      }))
    } catch (error) {
      throw new HttpException(error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500) 
    }
  }

  async deleteEnrolledCourse(deleteDto: Omit<EnrollmentDto, 'proficiency'>):Promise<void>{
    try {
      await this.enrollmentModel.findOneAndDelete({deleteDto})
    } catch (error) {
      throw new HttpException(error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500) 
    }
  }

  async deleteCourse(courseId:string):Promise<void>{
    try {
      await this.courseModel.findByIdAndDelete(courseId)
    } catch (error) {
      throw new HttpException(error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500) 
    }
  }

  async createAssessmentForCourse(courseAssementDto:CourseAssessementDto):Promise<CourseAssessement>{
    try {
      // check if assessement exist for this course, block if exist
      if(await this.courseAssessementModel.findOne({courseId:courseAssementDto.courseId})){
        
        const err:Err = {
          message: 'Assessement created for this course, delete this first before creating another one!',
          status: 400
        }
        throw new HttpException(err.message, err.status)
      }
      //generate different unique id for each question
      for (const courseQnA_x of courseAssementDto.qandA) {
        courseQnA_x.questionId = uuid()
      }
      // create a new assessement
      return await this.courseAssessementModel.create(courseAssementDto)

    } catch (error) {
      throw new HttpException(error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500) 
    }
  }

  async viewCourseAssessement(courseId:string):Promise<CourseAssessement>{
    try {
      return await this.courseAssessementModel.findOne({courseId:courseId}).lean()
    } catch (error) {
      throw new HttpException(error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500) 
    }
  }

  async deleteCourseAssessement(assessementId:string):Promise<void>{
    try {
      await this.courseAssessementModel.findByIdAndDelete(this.courseAssessementModel)
    } catch (error) {
      throw new HttpException(error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500) 
    }
  }

  async gradeAssessement(coursAssessementSubmitDto:CoursAssessementSubmitDto):Promise<any>{
    try {
     // verify assessementId
     if(!await this.courseAssessementModel.findOne({courseId:coursAssessementSubmitDto.courseId})){
        
      const err:Err = {
        message: 'Assessement id invalid!!',
        status: 400
      }
      throw new HttpException(err.message, err.status)
      }
      // fetch answers
      const qa = (await this.courseAssessementModel.findOne({ courseId: coursAssessementSubmitDto.courseId}).lean()).qandA

      const answersMem:number[] = []

      for (const submissionX of coursAssessementSubmitDto.submission) {
        const question_x = qa.find( qa_x => qa_x.questionId === submissionX.questionId)
        if(question_x.answer === submissionX.answer){
          answersMem.push(1)
        }else{
          answersMem.push(0)
        }
      }

      return {
        score: `${(answersMem.reduce((a,b)=> a+b,0) / answersMem.length ) * 100}%`
      }

    } catch (error) {
      console.log(error)
      throw new HttpException(error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500) 
    }
  }

}
