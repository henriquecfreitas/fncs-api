import { Repository } from "typeorm"
import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

import { ExpenseDTO, NewExpenseDTO, UpdateExpenseDTO } from "src/dtos"
import { Expense } from "src/entities"

@Injectable()
class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expensesRepository: Repository<Expense>,
  ) {}

  async createExpense(data: NewExpenseDTO) {
    const { description, value } = data
    const date = new Date(data.date)
    if (date > new Date()) throw new Error("Invalid Date")

    await this.expensesRepository.insert({
      description,
      value,
      date,
      user: { id: "aux" } as any,
    })
  }

  async findExpense(id: string): Promise<ExpenseDTO> {
    const expense = await this.expensesRepository.findOne({
      where: { id },
      relations: { user: true },
    })
    if (!expense) throw new NotFoundException()

    return new ExpenseDTO(expense)
  }

  async listExpenses(): Promise<Array<ExpenseDTO>> {
    const expenses = await this.expensesRepository.find({
      relations: { user: true },
    })
    return expenses.map(expense => new ExpenseDTO(expense))
  }

  async updateExpense(
    id: string,
    newData: UpdateExpenseDTO,
  ): Promise<ExpenseDTO> {
    const expense = await this.expensesRepository.findOne({
      where: { id },
      relations: { user: true },
    })
    if (!expense) throw new NotFoundException()

    Object.entries(newData).forEach(([key, value]) => {
      if (key === "date") expense.date = new Date(value)
      else expense[key] = value
    })
    await this.expensesRepository.save(expense)

    return new ExpenseDTO(expense)
  }

  async deleteExpense(id: string) {
    await this.expensesRepository.delete({ id })
  }
}

export default ExpensesService
