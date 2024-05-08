import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Expense } from 'src/entities'

import ExpensesController from './expenses.controller'
import ExpensesService from './expenses.service'

@Module({
  imports: [TypeOrmModule.forFeature([Expense])],
  providers: [ExpensesService],
  controllers: [ExpensesController],
})
export class ExpensesModule {}
