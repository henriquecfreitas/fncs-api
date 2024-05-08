import { Response as ExpressResponse } from "express"
import { Body, Controller, HttpStatus, Post, Response } from "@nestjs/common"

import { NewUserDTO } from "src/dtos"

import UsersService from "./users.service"

@Controller("users")
class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async newUser(@Body() body: NewUserDTO, @Response() res: ExpressResponse) {
    await this.usersService.newUser(body)
    res.sendStatus(HttpStatus.CREATED)
  }
}

export default UserController
