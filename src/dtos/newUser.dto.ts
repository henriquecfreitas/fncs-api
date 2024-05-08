import { IsEmail, IsString, IsStrongPassword } from "class-validator"

class NewUserDTO {
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsStrongPassword()
  password: string
}

export default NewUserDTO
