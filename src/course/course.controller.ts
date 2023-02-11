import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Res, Query } from '@nestjs/common';
import { CourseService } from './course.service';
import { CoursAssessementSubmitDto, CourseAssessementDto, CreateCourseDto, EnrollmentDto } from './dto/course.dto';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { Response } from 'express';
import { FrpRes } from 'src/common/interfaces/interfaces';
import { Category } from 'src/common/interfaces/category.enum';
import { RoleGuard } from 'src/guard/roles.guard';
import { Role } from 'src/guard/interface/role.enum';
import { Roles } from 'src/guard/decorator/roles.decorator';

@Controller('course')
@UseGuards(JwtAuthGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  private resBody(message:string, status:number, data?:object):FrpRes{
    return{
      message: message ?? 'success!',
      statusCode: status,
      data:data ?? null
    }
  }

  @UseGuards(RoleGuard)
  @Roles(Role.Admin)
  @Post('upload-course')
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @Req() req:any,
    @Res() res:Response
    ):Promise<Response>{

    const data:Awaited<object> = await this.courseService.uploadCourse(createCourseDto)

    return res.status(201).json(this.resBody('Course uploaded!',201,data))

  }

  @Get('view-courses')
  async viewCourses(
    @Res() res:Response,
    @Query('learningStyle') learningStyle:Category
  ):Promise<Response>{

    const data: Awaited<object> =  await this.courseService.viewCourses(learningStyle)

    return res.status(200).json(this.resBody('Course fetched!',200,data))

  }

  @Post('enroll')
  async enroll(
    @Body() enrollmentDto:EnrollmentDto,
    @Res() res:Response,
    @Req() req:any
    ):Promise<Response>{

      enrollmentDto.userId = req.user.userId

      const data:Awaited<object> = await this.courseService.enroll(enrollmentDto)

      return res.status(200).json(this.resBody('Enrolled for a new course!',201,data))
  }

  @Get('enroll/view')
  async viewEnrolledCourses(
    @Req() req:any,
    @Res() res:Response
    ):Promise<Response>{

      const data:Awaited<object> = await this.courseService.viewEnrolledCourses(req.user.userId)

      return res.status(200).json(this.resBody('Enrolled courses fetched!',200,data))
    
  }

  
  @Delete('enroll/delete/:courseId')
  async deleteEnrolledCourse(
    @Param('courseId') courseId:string,
    @Req() req:any,
    @Res() res:Response
  ):Promise<Response>{

    function payload():Omit<EnrollmentDto, 'proficiency'>{
      return {
        userId:req.user.userId,
        courseId:courseId
      }
    }
    await this.courseService.deleteEnrolledCourse(payload());

    return res.status(200).json(this.resBody(`Deleted an enrolled course with id: ${courseId}`,200))
  }

  @UseGuards(RoleGuard)
  @Roles(Role.Admin)
  @Delete('delete/:courseId')
  async deleteCourse(
    @Param('courseId') courseId:string,
    @Req() req:any,
    @Res() res:Response
  ):Promise<Response>{

    await this.courseService.deleteCourse(courseId);

    return res.status(200).json(this.resBody(`Deleted a course with id: ${courseId}`,200))
  }

  @UseGuards(RoleGuard)
  @Roles(Role.Admin)
  @Post('assessement/create')
  async createAssessement(
    @Body() courseAssementDto:CourseAssessementDto,
    @Req() req:any,
    @Res() res:Response
    ):Promise<Response>{

    const data:Awaited<object> = await this.courseService.createAssessmentForCourse(courseAssementDto)

    return res.status(201).json(this.resBody('Course assessement created!',201,data))

  }

  @Get('assessement/view/:courseId')
  async viewCourseAsessement(
    @Req() req:any,
    @Res() res:Response,
    @Param('courseId') courseId:string
    ):Promise<Response>{

      const data:Awaited<object> = await this.courseService.viewCourseAssessement(courseId)

      return res.status(200).json(this.resBody('Course assessement fetched!',200,data))
    
  }

  @UseGuards(RoleGuard)
  @Roles(Role.Admin)
  @Delete('assessement/delete/:courseId')
  async deleteCourseAssessement(
    @Param('courseId') courseId:string,
    @Req() req:any,
    @Res() res:Response
  ):Promise<Response>{

    await this.courseService.deleteCourseAssessement(courseId);

    return res.status(200).json(this.resBody(`Deleted an assessement with id: ${courseId}`,200))
  }

  @Post('assessement/grade')
  async gradeAssessement(
    @Body() coursAssessementSubmitDto:CoursAssessementSubmitDto,
    @Req() req:any,
    @Res() res:Response
    ):Promise<Response>{

      const data:Awaited<object> = await this.courseService.gradeAssessement(coursAssessementSubmitDto)

      return res.status(201).json(this.resBody('Course assessement graded!',201,data))
    
  }

}
