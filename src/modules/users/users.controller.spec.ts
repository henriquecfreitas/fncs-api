import { Response } from "express"
import { Test, TestingModule } from "@nestjs/testing"
import { UnprocessableEntityException } from "@nestjs/common"

import UsersController from "./users.controller"
import UsersService from "./users.service"

describe("UsersController", () => {
  const res = {} as Response
  const usersService = {
    newUser: jest.fn(),
  }

  let usersController: UsersController

  beforeEach(async () => {
    const Users: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile()

    usersController = Users.get<UsersController>(UsersController)

    res.sendStatus = jest.fn()

    usersService.newUser.mockClear()
  })

  describe("New User", () => {
    it("Should successfully create a new user", async () => {
      const body = {
        name: "Mock User",
        email: "mock@email.com",
        password: "password",
      }

      usersService.newUser.mockResolvedValue(undefined)

      const response = await usersController.newUser(body, res)
      expect(response).toBeUndefined()

      expect(usersService.newUser).toHaveBeenCalledWith(body)

      expect(res.sendStatus).toHaveBeenCalledWith(201)
    })

    it("Should throw on invalid data", async () => {
      const body = {
        name: "Mock User",
        email: "mock@email.com",
        password: "password",
      }
      const thrownError = new UnprocessableEntityException()

      usersService.newUser.mockRejectedValue(thrownError)

      try {
        await usersController.newUser(body, res)
        fail("Should not pass. Errors must be handled by Nest default handler")
      } catch (catchedError) {
        expect(catchedError).toBe(thrownError)
      }

      expect(res.sendStatus).not.toHaveBeenCalled()
    })
  })
})
