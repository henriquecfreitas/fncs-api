import { Response as ExpressResponse } from "express"
import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Response,
} from "@nestjs/common"

import ExpenseDTO from "src/dtos/expense.dto"

@Controller("expenses")
class ExpensesController {
  @Post()
  async createExpense(@Response() res: ExpressResponse) {
    res.sendStatus(HttpStatus.CREATED)
  }

  @Get(':id')
  async findExpense(@Param('id') id: string): Promise<ExpenseDTO> {
    return {} as any
  }

  @Get()
  async listExpenses(): Promise<Array<ExpenseDTO>> {
    return []
  }

  @Put(":id")
  async updateExpense(@Param('id') id: string): Promise<ExpenseDTO> {
    return {} as any
  }

  @Delete(":id")
  async deleteExpense(
    @Response() res: ExpressResponse,
    @Param('id') id: string
  ) {
    res.sendStatus(HttpStatus.NO_CONTENT)
  }
}

export default ExpensesController
