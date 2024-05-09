import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString } from "class-validator"

class LoginDTO {
  @IsEmail()
  @ApiProperty({ example: "john.smith@email.com", description: "User Email" })
  email: string
  
  @IsString()
  @ApiProperty({ example: "dkla65%saDs@daj8", description: "User Password" })
  password: string
}

export default LoginDTO
