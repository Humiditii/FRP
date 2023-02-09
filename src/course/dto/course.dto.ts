import { Category, Level } from 'src/common/interfaces/category.enum';
import { CourseCont } from 'src/common/interfaces/interfaces';

export class CreateCourseDto {
  readonly category: Category;
  readonly courseName: string;
  readonly courseImage?: string;
  courseContent?: Content;
}

interface Content {
  [Level.Beginner]?: CourseCont;
  [Level.Intermediate]?: CourseCont;
  [Level.Expert]?: CourseCont;
}

export class EnrollmentDto {
  userId: string;
  readonly courseId: string;
  readonly proficiency: Level;
}
