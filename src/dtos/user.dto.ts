import { IsEmail, IsString } from "class-validator"
import { User } from "src/entities"

class UserDTO {
  constructor(entity: User) {
    this.name = entity.name
    this.email = entity.email
  }

  @IsString()
  name: string

  @IsEmail()
  email: string
}

export default UserDTO
