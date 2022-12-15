export class SignupAuthDto {
    readonly username:string
    readonly email:string
    password:string
}

export class SignInAuthDto {
    readonly email:string
    readonly password:string
}
