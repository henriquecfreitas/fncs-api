import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { Expense, User } from "src/entities"
import { UsersModule } from "src/modules/users/users.module"

import AuthController from "./auth.controller"
import AuthService from "./auth.service"

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Expense, User])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
