import { IsDate, IsPositive, IsString, IsUUID, Length } from "class-validator"

import { Expense } from "src/entities"

class ExpenseDTO {
  constructor(entity: Expense) {
    if (!entity.user) throw new Error("User join is required")

    this.id = entity.id
    this.userId = entity.user.id
    this.userName = entity.user.name
    this.description = entity.description
    this.value = entity.value
    this.date = new Date(entity.date)
  }

  @IsUUID()
  id: string

  @IsUUID()
  userId: string

  @IsString()
  userName: string

  @Length(1, 191)
  description: string

  @IsPositive()
  value: number

  @IsDate()
  date: Date
}

export default ExpenseDTO
