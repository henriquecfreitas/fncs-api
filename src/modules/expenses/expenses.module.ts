import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { Expense, User } from "src/entities"

import ExpensesController from "./expenses.controller"
import ExpensesService from "./expenses.service"

@Module({
  imports: [TypeOrmModule.forFeature([Expense, User])],
  providers: [ExpensesService],
  controllers: [ExpensesController],
})
export class ExpensesModule {}
