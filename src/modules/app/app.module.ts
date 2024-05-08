import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { Expense, User } from "src/entities"
import { ExpensesModule } from "src/modules/expenses/expenses.module"

import { AppController } from "./app.controller"
import { AppService } from "./app.service"

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "mysql",
      database: "fncs",
      entities: [Expense, User],
      synchronize: true,
    }),
    ExpensesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
