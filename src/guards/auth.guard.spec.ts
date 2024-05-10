import { Request } from "express"
import { Test, TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { ExecutionContext, UnprocessableEntityException } from "@nestjs/common"

import { User } from "src/entities"
import * as jwt from "src/utils/jwt"

import AuthGuard from "./auth.guard"
import { AuthenticatedRequest } from "src/types"

describe("AuthGuard", () => {
  const getRequest = jest.fn()
  const context = {
    switchToHttp: () =>
      ({
        getRequest,
      }) as {
        getRequest: () => Request
      },
  } as ExecutionContext

  const validateTokenSpy = jest.spyOn(jwt, "validateToken")

  const userRepository = {
    findOneBy: jest.fn(),
  }

  let authGuard: AuthGuard

  beforeAll(async () => {
    const auth: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: getRepositoryToken(User),
          useFactory: () => userRepository,
        },
      ],
    }).compile()

    authGuard = auth.get<AuthGuard>(AuthGuard)
  })

  beforeEach(async () => {
    jest.clearAllMocks()
  })

  describe("canActivate", () => {
    it("Should authorize user", async () => {
      const token = "mock-access-token"
      const userId = "mock-user-id"
      const request = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
      const user = {
        id: userId,
        name: "John Smith",
      }

      getRequest.mockReturnValue(request)
      validateTokenSpy.mockResolvedValue({ id: userId })
      userRepository.findOneBy.mockResolvedValue(user)

      const response = await authGuard.canActivate(context)

      expect(response).toBe(true)
      expect((request as AuthenticatedRequest).user).toEqual(user)
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId })
      expect(validateTokenSpy).toHaveBeenCalledWith(token)
    })

    it("Should unauthorize for missing headers", async () => {
      const request = {}
      getRequest.mockReturnValue(request)

      const response = await authGuard.canActivate(context)
      expect(response).toBe(false)
    })

    it("Should unauthorize for missing authorization", async () => {
      const request = { headers: {} }
      getRequest.mockReturnValue(request)

      const response = await authGuard.canActivate(context)
      expect(response).toBe(false)
    })

    it("Should unauthorize for invalid authorization", async () => {
      const request = {
        headers: {
          autorization: 13,
        },
      }
      getRequest.mockReturnValue(request)

      const response = await authGuard.canActivate(context)
      expect(response).toBe(false)
    })

    it("Should unauthorize for missing accessToken", async () => {
      const request = {
        headers: {
          authorization: `Invalid format`,
        },
      }
      getRequest.mockReturnValue(request)

      const response = await authGuard.canActivate(context)
      expect(response).toBe(false)
    })

    it("Should unauthorize for invalid token", async () => {
      const request = {
        headers: {
          authorization: "Bearer mock-access-token",
        },
      }
      getRequest.mockReturnValue(request)
      validateTokenSpy.mockResolvedValue(false)

      const response = await authGuard.canActivate(context)
      expect(response).toBe(false)
    })

    it("Should unauthorize for invalid user", async () => {
      const token = "mock-access-token"
      const userId = "mock-user-id"
      const request = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }

      getRequest.mockReturnValue(request)
      validateTokenSpy.mockResolvedValue({ id: userId })
      userRepository.findOneBy.mockResolvedValue(null)

      const response = await authGuard.canActivate(context)
      expect(response).toBe(false)
    })
  })
})
