export interface Err {
    readonly message:string
    readonly status:number
}


export interface CourseCont {
    dateAdded:Date
    content:string
    materialName:string
    contentType:string

}

export class FrpRes {
    readonly message!:string
    readonly statusCode!:number
    readonly data!:object
}