import { Category } from "src/common/interfaces/category.enum"

export class CreateAssessmentDto {}

export class CreateQuestionDto {
    readonly entry:QuestionDto
}

export interface QuestionDto {
    readonly que: string
    readonly options: Options
}

export interface Options {
    readonly a: string
    readonly b: string
    readonly c: string
}

// {
//     question:"who is ur father",
//     option:{
//         a:'man',
//         b:'woman',
//         c:''
//     }
// }

export class SubmitAnswersDto {
    readonly answers:string[]
    userId:string
}

export class AssessementSubmit {
    readonly user_id:string
    readonly category:Category
}