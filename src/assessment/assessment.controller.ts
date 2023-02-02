import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Req } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { CreateAssessmentDto, CreateQuestionDto, SubmitAnswersDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import {Request, Response} from 'express';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { RoleGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/guard/decorator/roles.decorator';
import { Role } from 'src/guard/interface/role.enum';

@Controller('assessment')
@UseGuards(JwtAuthGuard)
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Post('/create')
  @UseGuards(RoleGuard)
  @Roles(Role.Admin)
  async create(
    @Body() createQuestionDto:CreateQuestionDto,
    @Res() res:Response
    ):Promise<Response>{
    const data =  await this.assessmentService.createAssessment(createQuestionDto);
    return res.status(201).json({
      message:"New question inserted",
      data:data
    })
  }

  @Get('/show')
  async showAssessment(
    @Res() res:Response
  ):Promise<Response>{
    return res.status(200).json({
      message:'Questions loaded',
      data: await this.assessmentService.showAsessment()
    })
  }

  @Post('/submit')
  async submitAssessment(
    @Body() submitAnswersDto:SubmitAnswersDto,
    @Res() res:Response,
    @Req() req:any
    ):Promise<Response>{
    submitAnswersDto.userId = req.user.userId
    const data =  await this.assessmentService.submitAssessment(submitAnswersDto);
    return res.status(201).json({
      message:"Learning style determined!",
      data:data
    })
  }


}
