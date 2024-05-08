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
  Request,
  Response,
  UseGuards,
} from "@nestjs/common"

import { AuthGuard } from "src/guards"
import { NewExpenseDTO, ExpenseDTO, UpdateExpenseDTO } from "src/dtos"

import ExpensesService from "./expenses.service"
import { AuthenticatedRequest } from "src/types"

@Controller("expenses")
@UseGuards(AuthGuard)
class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  async createExpense(
    @Request() req: AuthenticatedRequest,
    @Response() res: ExpressResponse,
    @Body() body: NewExpenseDTO,
  ) {
    const { user } = req
    await this.expensesService.createExpense(body, user)
    res.sendStatus(HttpStatus.CREATED)
  }

  @Get(":id")
  async findExpense(
    @Request() req: AuthenticatedRequest,
    @Param("id") id: string,
  ): Promise<ExpenseDTO> {
    const { user } = req
    return this.expensesService.findExpense(id, user)
  }

  @Get()
  async listExpenses(
    @Request() req: AuthenticatedRequest,
  ): Promise<Array<ExpenseDTO>> {
    const { user } = req
    return this.expensesService.listExpenses(user)
  }

  @Put(":id")
  async updateExpense(
    @Request() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() body: UpdateExpenseDTO,
  ): Promise<ExpenseDTO> {
    const { user } = req
    return this.expensesService.updateExpense(id, body, user)
  }

  @Delete(":id")
  async deleteExpense(
    @Request() req: AuthenticatedRequest,
    @Response() res: ExpressResponse,
    @Param("id") id: string,
  ) {
    const { user } = req
    await this.expensesService.deleteExpense(id, user)
    res.sendStatus(HttpStatus.NO_CONTENT)
  }
}

export default ExpensesController
