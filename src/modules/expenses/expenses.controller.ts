import { Response as ExpressResponse } from "express"
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Response,
} from "@nestjs/common"

import { NewExpenseDTO, ExpenseDTO, UpdateExpenseDTO } from "src/dtos"
import ExpensesService from "./expenses.service"

@Controller("expenses")
class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  async createExpense(
    @Response() res: ExpressResponse,
    @Body() body: NewExpenseDTO,
  ) {
    await this.expensesService.createExpense(body)
    res.sendStatus(HttpStatus.CREATED)
  }

  @Get(":id")
  async findExpense(@Param("id") id: string): Promise<ExpenseDTO> {
    return this.expensesService.findExpense(id)
  }

  @Get()
  async listExpenses(): Promise<Array<ExpenseDTO>> {
    return this.expensesService.listExpenses()
  }

  @Put(":id")
  async updateExpense(
    @Param("id") id: string,
    @Body() body: UpdateExpenseDTO,
  ): Promise<ExpenseDTO> {
    return this.expensesService.updateExpense(id, body)
  }

  @Delete(":id")
  async deleteExpense(
    @Response() res: ExpressResponse,
    @Param("id") id: string,
  ) {
    await this.expensesService.deleteExpense(id)
    res.sendStatus(HttpStatus.NO_CONTENT)
  }
}

export default ExpensesController
