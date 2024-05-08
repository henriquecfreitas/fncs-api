import { Repository } from "typeorm"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

import { ExpenseDTO, NewExpenseDTO, UpdateExpenseDTO } from "src/dtos"
import { Expense } from "src/entities"

@Injectable()
class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
  ) {}

  async createExpense(expense: NewExpenseDTO) {
  }

  async findExpense(id: string): Promise<ExpenseDTO> {
    return {} as any
  }

  async listExpenses(): Promise<Array<ExpenseDTO>> {
    return []
  }

  async updateExpense(
    id: string,
    newData: UpdateExpenseDTO,
  ): Promise<ExpenseDTO> {
    return {} as any
  }

  async deleteExpense(id: string) {
  }
}

export default ExpensesService
