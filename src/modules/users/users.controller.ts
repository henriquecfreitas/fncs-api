import { Response as ExpressResponse } from "express"
import { Body, Controller, HttpStatus, Post, Response } from "@nestjs/common"
import { ApiResponse, ApiTags } from "@nestjs/swagger"

import { NewUserDTO } from "src/dtos"

import UsersService from "./users.service"

@Controller("users")
@ApiTags("Users")
class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: "User successfully created",
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request",
  })
  @ApiResponse({
    status: 422,
    description: "Email already in use",
  })
  async newUser(@Body() body: NewUserDTO, @Response() res: ExpressResponse) {
    await this.usersService.newUser(body)
    res.sendStatus(HttpStatus.CREATED)
  }
}

export default UserController
