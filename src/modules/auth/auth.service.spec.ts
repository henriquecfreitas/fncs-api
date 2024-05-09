import { Test, TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { UnauthorizedException } from "@nestjs/common"

import { User } from "src/entities"
import UsersService from "src/modules/users/users.service"

import AuthService from "./auth.service"

describe("AuthService", () => {
  const userRepository = {
    findOneBy: jest.fn(),
  }
  const userService = {
    hashPassword: jest.fn(),
  }

  let authService: AuthService

  beforeAll(async () => {
    const auth: TestingModule = await Test.createTestingModule({
      controllers: [AuthService],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useFactory: () => userRepository,
        },
        {
          provide: UsersService,
          useFactory: () => userService,
        },
      ],
    }).compile()

    authService = auth.get<AuthService>(AuthService)
  })

  beforeEach(async () => {
    userRepository.findOneBy.mockClear()
    userService.hashPassword.mockClear()
  })

  describe("Login", () => {
    it("Should successfully login", async () => {
      const body = { email: "mock@email.com", password: "password" }
      const passwordHash = Buffer.from("password", "base64")

      const userData = {
        name: "Mock User",
        email: "mock@email.com",
        passwordHash: "password",
      }

      userRepository.findOneBy.mockResolvedValue(userData)
      userService.hashPassword.mockReturnValue(passwordHash)

      const response = await authService.login(body)
      expect(typeof response.accessToken).toBe("string")
      expect(response.userData).toEqual({
        name: userData.name,
        email: userData.email,
      })

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: body.email,
      })
      expect(userService.hashPassword).toHaveBeenCalledWith(
        body.email,
        body.password,
      )
    })

    it("Should throw on invalid login", async () => {
      const body = { email: "mock@email.com", password: "wrong-password" }
      const passwordHash = Buffer.from("wrong-password", "base64")

      const userData = {
        name: "Mock User",
        email: "mock@email.com",
        passwordHash: "right-password",
      }

      userRepository.findOneBy.mockResolvedValue(userData)
      userService.hashPassword.mockReturnValue(passwordHash)

      try {
        await authService.login(body)
        fail("Should throw Unauthorized Excpetion")
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException)
      }
    })
  })
})
