import { ApiProperty } from "@nestjs/swagger"
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
  @ApiProperty({ format: "uuid", description: "Expense ID" })
  id: string

  @IsUUID()
  @ApiProperty({ format: "uuid", description: "Owner user ID" })
  userId: string

  @IsString()
  @ApiProperty({ example: "John Smith", description: "Owner user name" })
  userName: string

  @Length(1, 191)
  @ApiProperty({ example: "Uber ride", description: "Expense description" })
  description: string

  @IsPositive()
  @ApiProperty({ example: 20.24, description: "Expense value in BRL" })
  value: number

  @IsDate()
  @ApiProperty({ example: new Date(), description: "Expense date" })
  date: Date
}

export default ExpenseDTO
