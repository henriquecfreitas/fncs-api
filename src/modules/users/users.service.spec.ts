import { Test, TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { UnprocessableEntityException } from "@nestjs/common"

import { User } from "src/entities"
import * as hash from "src/utils/hash"

import UsersService from "./users.service"

describe("UsersService", () => {
  const userRepository = {
    existsBy: jest.fn(),
    insert: jest.fn(),
  }

  let usersService: UsersService

  beforeAll(async () => {
    const auth: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: () => userRepository,
        },
      ],
    }).compile()

    usersService = auth.get<UsersService>(UsersService)
  })

  beforeEach(async () => {
    jest.clearAllMocks()
  })

  describe("New User", () => {
    it("Should successfully create new user", async () => {
      const body = {
        name: "John Smith",
        email: "mock@email.com",
        password: "password",
      }
      const passwordHash = "password-hash"
      const passwordHashBuffer = Buffer.from("password", "base64")

      userRepository.insert.mockResolvedValue({})
      userRepository.existsBy.mockResolvedValue(false)

      const hashKeySpy = jest.spyOn(hash, "hashKey")
      hashKeySpy.mockReturnValue(passwordHashBuffer)
      const parseHashBufferSpy = jest.spyOn(hash, "parseHashBuffer")
      parseHashBufferSpy.mockReturnValue(passwordHash)

      await usersService.newUser(body)

      expect(hashKeySpy).toHaveBeenCalledWith(
        body.password,
        body.email + "BASE_SALT",
      )
      expect(parseHashBufferSpy).toHaveBeenCalledWith(passwordHashBuffer)
      expect(userRepository.insert).toHaveBeenCalledWith({
        passwordHash,
        name: body.name,
        email: body.email,
      })
    })

    it("Should throw on duplicated email", async () => {
      const body = {
        name: "John Smith",
        email: "mock@email.com",
        password: "password",
      }
      userRepository.existsBy.mockResolvedValue(true)

      try {
        await usersService.newUser(body)
        fail("Should throw Unprocessable Entity Excpetion")
      } catch (error) {
        expect(error).toBeInstanceOf(UnprocessableEntityException)
      }

      expect(userRepository.existsBy).toHaveBeenCalledWith({
        email: body.email,
      })
    })
  })
})
