import { Response } from "express"
import { Test, TestingModule } from "@nestjs/testing"
import { UnauthorizedException } from "@nestjs/common"

import AuthController from "./auth.controller"
import AuthService from "./auth.service"

describe("AuthController", () => {
  const res = {} as Response
  const authService = {
    login: jest.fn(),
  }

  let authController: AuthController

  beforeAll(async () => {
    const auth: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile()

    authController = auth.get<AuthController>(AuthController)
  })

  beforeEach(async () => {
    res.send = jest.fn()
    res.setHeader = jest.fn()

    authService.login.mockClear()
  })

  describe("Login", () => {
    it("Should successfully login", async () => {
      const body = { email: "mock@email.com", password: "password" }

      const accessToken = "mock.access.token"
      const userData = { name: "Mock User", email: "mock@email.com" }

      authService.login.mockResolvedValue({ userData, accessToken })

      const response = await authController.login(body, res)
      expect(response).toBeUndefined()

      expect(authService.login).toHaveBeenCalledWith(body)

      expect(res.setHeader).toHaveBeenCalledWith("access-token", accessToken)
      expect(res.send).toHaveBeenCalledWith({ userData })
    })

    it("Should throw on invalid login", async () => {
      const body = { email: "mock@email.com", password: "password" }
      const thrownError = new UnauthorizedException()

      authService.login.mockRejectedValue(thrownError)

      try {
        await authController.login(body, res)
        fail("Should not pass. Errors must be handled by Nest default handler")
      } catch (catchedError) {
        expect(catchedError).toBe(thrownError)
      }

      expect(res.setHeader).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
    })
  })
})
