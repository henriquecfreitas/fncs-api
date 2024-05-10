import { Repository } from "typeorm"
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

import { ExpenseDTO, NewExpenseDTO, UpdateExpenseDTO } from "src/dtos"
import { Expense, User } from "src/entities"
import { isFutureDate, sendMail } from "src/utils"

@Injectable()
class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expensesRepository: Repository<Expense>,
  ) {}

  async createExpense(data: NewExpenseDTO, user: User) {
    const { description, value, date } = data
    if (isFutureDate(date)) throw new BadRequestException("Invalid Date")

    await this.expensesRepository.insert({
      description,
      value,
      date: new Date(date),
      user,
    })

    try {
      await sendMail({
        to: user.email,
        subject: "FNCS | New Expense",
        text: `A new expense has been inserted for your FNCS account: ${description}`,
        html: `A new expense has been inserted for your FNCS account.<br><b>${description}</b><br><sub>FNCS | 2024</sub>`,
      })
    } catch (e) {
      console.error(e)
    }
  }

  async findExpense(id: string, user: User): Promise<ExpenseDTO> {
    const expense = await this.expensesRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: { user: true },
    })
    if (!expense) throw new NotFoundException()

    return new ExpenseDTO(expense)
  }

  async listExpenses(user: User): Promise<Array<ExpenseDTO>> {
    const expenses = await this.expensesRepository.find({
      where: { user: { id: user.id } },
      relations: { user: true },
    })
    return expenses.map(expense => new ExpenseDTO(expense))
  }

  async updateExpense(
    id: string,
    newData: UpdateExpenseDTO,
    user: User,
  ): Promise<ExpenseDTO> {
    const expense = await this.expensesRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: { user: true },
    })
    if (!expense) throw new NotFoundException()

    Object.entries(newData).forEach(([key, value]) => {
      if (key === "date") {
        if (isFutureDate(value)) throw new BadRequestException("Invalid Date")
        expense.date = new Date(value)
      } else expense[key] = value
    })
    await this.expensesRepository.save(expense)

    return new ExpenseDTO(expense)
  }

  async deleteExpense(id: string, user: User) {
    await this.expensesRepository.delete({ id, user: { id: user.id } })
  }
}

export default ExpensesService
