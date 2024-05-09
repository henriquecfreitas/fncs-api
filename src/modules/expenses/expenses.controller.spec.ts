import { Response } from "express"
import { Test, TestingModule } from "@nestjs/testing"
import { NotFoundException, BadRequestException } from "@nestjs/common"

import { AuthenticatedRequest } from "src/types"

import ExpensesController from "./expenses.controller"
import ExpensesService from "./expenses.service"
import { AuthGuard } from "src/guards"

describe("ExpensesController", () => {
  const req = {
    user: {
      id: "mock-user-id",
      name: "Mock User",
      email: "mock@email.com",
    },
  } as AuthenticatedRequest
  const res = {} as Response

  const expensesService = {
    createExpense: jest.fn(),
    findExpense: jest.fn(),
    listExpenses: jest.fn(),
    updateExpense: jest.fn(),
    deleteExpense: jest.fn(),
  }

  let expensesController: ExpensesController

  beforeEach(async () => {
    const Expenses: TestingModule = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [ExpensesService],
    })
      .overrideProvider(ExpensesService)
      .useValue(expensesService)
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile()

    expensesController = Expenses.get<ExpensesController>(ExpensesController)

    res.sendStatus = jest.fn()

    jest.clearAllMocks()
  })

  describe("Create Expense", () => {
    it("Should successfully create a new expense", async () => {
      const body = {
        description: "Expense description",
        value: 10,
        date: new Date(),
      }

      expensesService.createExpense.mockResolvedValue(undefined)

      const response = await expensesController.createExpense(req, res, body)
      expect(response).toBeUndefined()

      expect(expensesService.createExpense).toHaveBeenCalledWith(body, req.user)

      expect(res.sendStatus).toHaveBeenCalledWith(201)
    })

    it("Should throw on invalid data", async () => {
      const body = {
        description: "Expense description",
        value: 10,
        date: new Date(),
      }
      const thrownError = new BadRequestException()

      expensesService.createExpense.mockRejectedValue(thrownError)

      try {
        await expensesController.createExpense(req, res, body)
        fail("Should not pass. Errors must be handled by Nest default handler")
      } catch (catchedError) {
        expect(catchedError).toBe(thrownError)
      }

      expect(res.sendStatus).not.toHaveBeenCalled()
    })
  })

  describe("Find Expense", () => {
    it("Should return the requested expense", async () => {
      const id = "mock-expense-id"
      const expense = {
        id,
        description: "Mock Expense",
        value: 20,
        date: new Date(),
      }
      expensesService.findExpense.mockResolvedValue(expense)

      const response = await expensesController.findExpense(req, id)
      expect(response).toBe(expense)

      expect(expensesService.findExpense).toHaveBeenCalledWith(id, req.user)
    })

    it("Should throw on invalid data", async () => {
      const id = "mock-expense-id"
      const thrownError = new NotFoundException()

      expensesService.findExpense.mockRejectedValue(thrownError)

      try {
        await expensesController.findExpense(req, id)
        fail("Should not pass. Errors must be handled by Nest default handler")
      } catch (catchedError) {
        expect(catchedError).toBe(thrownError)
      }
    })
  })

  describe("List Expenses", () => {
    it("Should return the expenses array", async () => {
      const expenses = [
        {
          id: "mock-expense-id",
          description: "Mock Expense",
          value: 20,
          date: new Date(),
        },
      ]
      expensesService.listExpenses.mockResolvedValue(expenses)

      const response = await expensesController.listExpenses(req)
      expect(response).toBe(expenses)

      expect(expensesService.listExpenses).toHaveBeenCalledWith(req.user)
    })
  })

  describe("Update Expense", () => {
    it("Should successfully update the requested expense", async () => {
      const id = "mock-expense-id"
      const body = { description: "New Mock Expense" }
      const expense = {
        id,
        description: "New Mock Expense",
        value: 20,
        date: new Date(),
      }

      expensesService.updateExpense.mockResolvedValue(expense)

      const response = await expensesController.updateExpense(req, id, body)
      expect(response).toBe(expense)

      expect(expensesService.updateExpense).toHaveBeenCalledWith(
        id,
        body,
        req.user,
      )
    })

    it("Should throw on invalid data", async () => {
      const id = "mock-expense-id"
      const body = { description: "New Mock Expense" }
      const thrownError = new NotFoundException()

      expensesService.updateExpense.mockRejectedValue(thrownError)

      try {
        await expensesController.updateExpense(req, id, body)
        fail("Should not pass. Errors must be handled by Nest default handler")
      } catch (catchedError) {
        expect(catchedError).toBe(thrownError)
      }
    })
  })

  describe("Delete Expense", () => {
    it("Should successfully delete the requested expense", async () => {
      const id = "mock-expense-id"
      expensesService.deleteExpense.mockResolvedValue(undefined)

      const response = await expensesController.deleteExpense(req, res, id)
      expect(response).toBeUndefined()

      expect(expensesService.deleteExpense).toHaveBeenCalledWith(id, req.user)

      expect(res.sendStatus).toHaveBeenCalledWith(204)
    })
  })
})
