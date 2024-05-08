import { IsEmail, IsString } from 'class-validator'

class NewUserDTO {
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsString()
  password: string
}

export default NewUserDTO
