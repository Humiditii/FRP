import { Category, Level } from 'src/common/interfaces/category.enum';
import { CourseCont } from 'src/common/interfaces/interfaces';

export class CreateCourseDto {
  readonly category: Category;
  readonly courseName: string;
  readonly courseImage?: string;
  courseContent?: Content;
}

interface Content {
  [Level.Beginner]?: CourseCont[];
  [Level.Intermediate]?: CourseCont[];
  [Level.Expert]?: CourseCont[];
}

export class EnrollmentDto {
  userId: string;
  readonly courseId: string;
  readonly proficiency: Level;
}


export class CourseAssessementDto{
  readonly courseId:string
  readonly qandA:QuestionAnswerStruct[]
}

export class QuestionAnswerStruct {
  question:string
  questionId:string
  answer:string
  options:string[]
}

export class CoursAssessementSubmitDto {
  readonly courseId:string
  readonly submission:AnswerStruct[]
}

class AnswerStruct {
  readonly questionId:string
  readonly answer:string
}