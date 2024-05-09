import { Request } from "express"
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"

import { User } from "src/entities"
import { validateToken } from "src/utils"
import { AuthenticatedRequest } from "src/types"

@Injectable()
class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  canActivate(context: ExecutionContext) {
    const httpContext = context.switchToHttp()
    const request = httpContext.getRequest<Request>()
    return this.validateAuthRequest(request)
  }

  private async validateAuthRequest(request: Request) {
    const authorization = request.headers?.authorization
    if (!authorization || typeof authorization !== "string") return false

    const [_, accessToken] = authorization.split("Bearer ")
    if (!accessToken) return false

    const payload = await validateToken(accessToken)
    if (!payload) return false

    const user = await this.userRepository.findOneBy({ id: payload.id })
    if (!user) return false

    const authenticatedRequest = request as AuthenticatedRequest
    authenticatedRequest.user = user

    return true
  }
}

export default AuthGuard
