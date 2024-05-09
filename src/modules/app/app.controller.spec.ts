import { Response } from "express"
import { Test, TestingModule } from "@nestjs/testing"

import { AppController } from "./app.controller"

describe("AppController", () => {
  const res = {} as Response
  let appController: AppController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile()

    appController = app.get<AppController>(AppController)

    res.sendStatus = jest.fn()
  })

  describe("Health Check", () => {
    it("Should send 204 status code", () => {
      const response = appController.healthCheck(res)
      expect(response).toBeUndefined()
      expect(res.sendStatus).toHaveBeenCalledWith(204)
    })
  })
})
