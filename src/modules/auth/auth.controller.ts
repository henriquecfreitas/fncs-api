import { Response as ExpressResponse } from "express"
import { Body, Controller, Post, Response } from "@nestjs/common"

import { LoginDTO, LoginResponseDTO } from "src/dtos"

import AuthService from "./auth.service"

@Controller()
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(
    @Body() body: LoginDTO,
    @Response() res: ExpressResponse<LoginResponseDTO>,
  ) {
    const { userData, accessToken } = await this.authService.login(body)

    res.setHeader("access-token", accessToken)
    res.send({ userData })
  }
}

export default AuthController
