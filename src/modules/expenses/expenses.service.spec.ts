import { Test, TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { BadRequestException, NotFoundException } from "@nestjs/common"

import { Expense, User } from "src/entities"
import * as date from "src/utils/date"
import * as mail from "src/utils/mail"

import ExpensesService from "./expenses.service"

const user = {
  id: "mock-user-id",
  name: "Mock User",
  email: "mock@email.com",
} as User

describe("expensesService", () => {
  const expensesRepository = {
    insert: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  }

  let expensesService: ExpensesService

  beforeAll(async () => {
    const auth: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: getRepositoryToken(Expense),
          useFactory: () => expensesRepository,
        },
      ],
    }).compile()

    expensesService = auth.get<ExpensesService>(ExpensesService)
  })

  beforeEach(async () => {
    jest.clearAllMocks()
  })

  describe("Create Expense", () => {
    const sendMailSpy = jest.spyOn(mail, "sendMail")

    it("Should successfully create a new expense", async () => {
      const body = {
        description: "Expense description",
        value: 20.13,
        date: new Date(1733179913000),
      }
      jest.spyOn(date, "isFutureDate").mockReturnValue(false)
      sendMailSpy.mockResolvedValue()

      expensesRepository.insert.mockResolvedValue({})

      await expensesService.createExpense(body, user)

      expect(expensesRepository.insert).toHaveBeenCalledWith({
        user,
        ...body,
      })
      expect(sendMailSpy).toHaveBeenCalledWith({
        to: user.email,
        subject: "FNCS | New Expense",
        text: `A new expense has been inserted for your FNCS account: ${body.description}`,
        html: `A new expense has been inserted for your FNCS account.<br><b>${body.description}</b><br><sub>FNCS | 2024</sub>`,
      })
    })

    it("Should throw on invalid data", async () => {
      const body = {
        description: "Expense description",
        value: 20.13,
        date: new Date(),
      }
      jest.spyOn(date, "isFutureDate").mockReturnValue(true)

      try {
        await expensesService.createExpense(body, user)
        fail("Should throw Bad Request Exception")
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException)
      }

      expect(expensesRepository.insert).not.toHaveBeenCalled()
      expect(sendMailSpy).not.toHaveBeenCalled()
    })

    it("Should not throw on failed mail sending", async () => {
      const body = {
        description: "Expense description",
        value: 20.13,
        date: new Date(1733179913000),
      }
      jest.spyOn(date, "isFutureDate").mockReturnValue(false)

      const error = new Error()
      sendMailSpy.mockRejectedValue(error)
      const consoleErrorSpy = jest.spyOn(console, "error")
      consoleErrorSpy.mockImplementation(jest.fn())

      expensesRepository.insert.mockResolvedValue({})

      await expect(
        expensesService.createExpense(body, user),
      ).resolves.not.toThrow()

      expect(consoleErrorSpy).toHaveBeenCalledWith(error)
      expect(sendMailSpy).toHaveBeenCalled()
    })
  })

  describe("List Expenses", () => {
    it("Should successfully list the expenses", async () => {
      const expenses = [
        {
          id: "mock-expense-id",
          user,
          description: "Expense description",
          value: 20.13,
          date: new Date(),
        },
      ]
      expensesRepository.find.mockResolvedValue(expenses)

      const result = await expensesService.listExpenses(user)
      expect(result).toEqual([
        {
          id: expenses[0].id,
          userId: expenses[0].user.id,
          userName: expenses[0].user.name,
          description: expenses[0].description,
          value: expenses[0].value,
          date: expenses[0].date,
        },
      ])
    })
  })

  describe("Find Expense", () => {
    it("Should successfully find the requested expense", async () => {
      const id = "mock-expense-id"
      const expense = {
        id,
        user,
        description: "Expense description",
        value: 20.13,
        date: new Date(),
      }
      expensesRepository.findOne.mockResolvedValue(expense)

      const result = await expensesService.findExpense(id, user)
      expect(result).toEqual({
        id: expense.id,
        userId: expense.user.id,
        userName: expense.user.name,
        description: expense.description,
        value: expense.value,
        date: expense.date,
      })
    })

    it("Should thrown on not found", async () => {
      expensesRepository.findOne.mockResolvedValue(null)
      try {
        await expensesService.findExpense("mock-requested-id", user)
        fail("Should throw Not Found Exception")
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException)
      }
    })
  })

  describe("Update Expense", () => {
    it("Should successfully update the requested expense", async () => {
      const id = "mock-expense-id"
      const body = {
        date: new Date(),
        description: "New expense description",
      }
      const expense = {
        user,
        description: "Expense description",
        value: 20.13,
        date: new Date(),
      }
      jest.spyOn(date, "isFutureDate").mockReturnValue(false)

      expensesRepository.findOne.mockResolvedValue(expense)
      expensesRepository.save.mockResolvedValue({})

      await expensesService.updateExpense(id, body, user)

      expect(expensesRepository.findOne).toHaveBeenCalledWith({
        where: { id, user: { id: user.id } },
        relations: { user: true },
      })
      expect(expensesRepository.save).toHaveBeenCalledWith(expense)
    })

    it("Should thrown on not found", async () => {
      expensesRepository.findOne.mockResolvedValue(null)
      try {
        await expensesService.updateExpense("mock-requested-id", {}, user)
        fail("Should throw Not Found Exception")
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException)
      }
    })

    it("Should throw on invalid data", async () => {
      const id = "mock-expense-id"
      const body = { date: new Date() }
      const expense = {
        user,
        description: "Expense description",
        value: 20.13,
        date: new Date(),
      }
      jest.spyOn(date, "isFutureDate").mockReturnValue(true)

      expensesRepository.findOne.mockResolvedValue(expense)

      try {
        await expensesService.updateExpense(id, body, user)
        fail("Should throw Bad Request Exception")
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException)
      }

      expect(expensesRepository.save).not.toHaveBeenCalled()
    })
  })

  describe("Delete Expense", () => {
    it("Should successfully delete the requested expense", async () => {
      const id = "mock-expense-id"

      expensesRepository.delete.mockResolvedValue({})

      await expensesService.deleteExpense(id, user)

      expect(expensesRepository.delete).toHaveBeenCalledWith({
        id,
        user: { id: user.id },
      })
    })
  })
})
