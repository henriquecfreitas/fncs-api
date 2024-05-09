import { Response as ExpressResponse } from "express"
import { ApiResponse, ApiTags } from "@nestjs/swagger"
import { Body, Controller, Post, Response } from "@nestjs/common"

import { LoginDTO, LoginResponseDTO } from "src/dtos"

import AuthService from "./auth.service"

@Controller()
@ApiTags("Auth")
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiResponse({
    status: 201,
    headers: { "access-token": { description: "Access Token" } },
    description: "Successful Login",
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request",
  })
  @ApiResponse({
    status: 401,
    description: "Unsuccessful Login",
  })
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
