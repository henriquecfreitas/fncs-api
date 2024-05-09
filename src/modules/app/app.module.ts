import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { Expense, User } from "src/entities"
import { AuthModule } from "src/modules/auth/auth.module"
import { ExpensesModule } from "src/modules/expenses/expenses.module"
import { UsersModule } from "src/modules/users/users.module"

import { AppController } from "./app.controller"

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
    AuthModule,
    ExpensesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
