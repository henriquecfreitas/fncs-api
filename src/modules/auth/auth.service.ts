import { Repository } from "typeorm"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

import { User } from "src/entities"
import { validateHash, generateJWT } from "src/utils"
import { LoginDTO, UserDTO } from "src/dtos"
import UserService from "src/modules/users/users.service"

@Injectable()
class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login({ email, password }: LoginDTO): Promise<{
    userData: UserDTO
    accessToken: string
  }> {
    const user = await this.userRepository.findOneBy({ email })
    const passwordHash = this.userService.hashPassword(email, password)
    const isValid = user && validateHash(passwordHash, user.passwordHash)
    if (!isValid) throw new UnauthorizedException()

    const accessToken = await generateJWT(user)

    return {
      userData: new UserDTO(user),
      accessToken,
    }
  }
}

export default AuthService
