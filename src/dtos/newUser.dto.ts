import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, IsStrongPassword } from "class-validator"

class NewUserDTO {
  @IsString()
  @ApiProperty({ example: "John Smith", description: "User Name" })
  name: string

  @IsEmail()
  @ApiProperty({ example: "john.smith@email.com", description: "User Email" })
  email: string

  @IsStrongPassword()
  @ApiProperty({ example: "dkla65%saDs@daj8", description: "User Password" })
  password: string
}

export default NewUserDTO
