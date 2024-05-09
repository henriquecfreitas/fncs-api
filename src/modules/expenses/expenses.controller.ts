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
import { ApiBasicAuth, ApiResponse, ApiTags } from "@nestjs/swagger"

import { AuthGuard } from "src/guards"
import { NewExpenseDTO, ExpenseDTO, UpdateExpenseDTO } from "src/dtos"

import ExpensesService from "./expenses.service"
import { AuthenticatedRequest } from "src/types"

@Controller("expenses")
@ApiTags("Expenses")
@UseGuards(AuthGuard)
class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiBasicAuth()
  @ApiResponse({
    status: 201,
    description: "Expense successfully created",
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request",
  })
  @ApiResponse({
    status: 401,
    description: "Missing authentication",
  })
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
  @ApiBasicAuth()
  @ApiResponse({
    status: 200,
    type: ExpenseDTO,
  })
  @ApiResponse({
    status: 401,
    description: "Missing authentication",
  })
  @ApiResponse({
    status: 404,
    description: "Expense not found",
  })
  async findExpense(
    @Request() req: AuthenticatedRequest,
    @Param("id") id: string,
  ): Promise<ExpenseDTO> {
    const { user } = req
    return this.expensesService.findExpense(id, user)
  }

  @Get()
  @ApiBasicAuth()
  @ApiResponse({
    status: 200,
    type: [ExpenseDTO],
  })
  @ApiResponse({
    status: 401,
    description: "Missing authentication",
  })
  async listExpenses(
    @Request() req: AuthenticatedRequest,
  ): Promise<Array<ExpenseDTO>> {
    const { user } = req
    return this.expensesService.listExpenses(user)
  }

  @Put(":id")
  @ApiBasicAuth()
  @ApiResponse({
    status: 200,
    type: [ExpenseDTO],
  })
  @ApiResponse({
    status: 401,
    description: "Missing authentication",
  })
  @ApiResponse({
    status: 404,
    description: "Expense not found",
  })
  async updateExpense(
    @Request() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() body: UpdateExpenseDTO,
  ): Promise<ExpenseDTO> {
    const { user } = req
    return this.expensesService.updateExpense(id, body, user)
  }

  @Delete(":id")
  @ApiBasicAuth()
  @ApiResponse({
    status: 204,
    description: "Successfully deleted resource",
  })
  @ApiResponse({
    status: 401,
    description: "Missing authentication",
  })
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
