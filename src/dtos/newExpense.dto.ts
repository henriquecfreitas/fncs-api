import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsPositive, Length } from "class-validator"

class NewExpenseDTO {
  @Length(1, 191)
  @ApiProperty({ example: "Uber ride", description: "Expense description" })
  description: string
  
  @IsPositive()
  @ApiProperty({ example: 20.24, description: "Expense value in BRL" })
  value: number
  
  @IsDateString({ strict: true })
  @ApiProperty({ example: new Date(), description: "Expense date" })
  date: Date
}

export default NewExpenseDTO
