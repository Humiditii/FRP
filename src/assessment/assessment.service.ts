import { HttpException, Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/common/interfaces/category.enum';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { AssessementSubmit, CreateAssessmentDto, CreateQuestionDto, SubmitAnswersDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { Assessment, AssessmentDocument } from './schema/assessment.schema';
import { Question, QuestionDocument } from './schema/questions.schema';

@Injectable()
export class AssessmentService {

  constructor(
    @InjectModel(Question.name) private questionModel:Model<QuestionDocument>,
    @InjectModel(Assessment.name) private assessmentModel:Model<AssessmentDocument>
  ){}

  private readonly ISE: string = 'Internal server error';

  async createAssessment(createQuestionDto:CreateQuestionDto):Promise<any>{
    try {
      return await new this.questionModel(createQuestionDto).save()
    } catch (error) {
      throw new HttpException(error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500) 
    }
  }

  async showAsessment():Promise<QuestionDocument>{
    try {
      return this.questionModel.find().lean()
    } catch (error) {
      throw new HttpException(error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500) 
    }
  }

  async submitAssessment(submitAnswersDto:SubmitAnswersDto):Promise<any>{
    try {
      const mode:string = this.mode(submitAnswersDto.answers)

      const payload:AssessementSubmit = {
        user_id:submitAnswersDto.userId,
        category: this.categorySelector(mode)
      }
      const user_asse = await this.assessmentModel.findOne({user_id:submitAnswersDto.userId})
      if(!user_asse){
        return await new this.assessmentModel(payload).save()
      }
      return await this.assessmentModel.findByIdAndUpdate(user_asse._id,{category:this.categorySelector(mode)}, {new: true})
    } catch (error) {
      throw new HttpException(error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500) 
    }
  }

  private mode(array:string[]):string{
      if(array.length == 0)
          return null;
      const modeMap = {};
      let maxEl = array[0], maxCount = 1;
      for(var i = 0; i < array.length; i++)
      {
          var el = array[i];
          if(modeMap[el] == null)
              modeMap[el] = 1;
          else
              modeMap[el]++;  
          if(modeMap[el] > maxCount)
          {
              maxEl = el;
              maxCount = modeMap[el];
          }
      }
      return maxEl;
  }

  private categorySelector(option:string):Category{
    let cat:Category
    switch (option) {
      case 'a': return cat = Category.VISUAL;
      case 'b': return cat = Category.AUDITORY;
      case 'c': return cat = Category.KINAESTHETIC;
      default:
        break;
    }
  }
 
}
