import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"

import { User } from "src/entities"
import { NewUserDTO } from "src/dtos"
import { hashKey, parseHashBuffer } from "src/utils"
import { UnprocessableEntityException } from "@nestjs/common"

class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async newUser(body: NewUserDTO) {
    const { email, name } = body
    const duplicatedEmail = await this.userRepository.existsBy({ email })
    if (duplicatedEmail)
      throw new UnprocessableEntityException("Email already in use")

    const passwordHash = this.hashPasswordToString(email, body.password)
    await this.userRepository.insert({ email, name, passwordHash })
  }

  public hashPassword(email: string, password: string) {
    const pwdHashSalt = email + "BASE_SALT"
    return hashKey(password, pwdHashSalt)
  }

  public hashPasswordToString(email: string, password: string) {
    const passwordHashBuffer = this.hashPassword(email, password)
    return parseHashBuffer(passwordHashBuffer)
  }
}

export default UsersService
