import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsOptional, IsPositive, Length } from "class-validator"

class UpdateExpenseDTO {
  @Length(1, 191)
  @IsOptional()
  @ApiProperty({
    required: false,
    example: "Uber ride",
    description: "Expense description",
  })
  description?: string

  @IsPositive()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 20.24,
    description: "Expense value in BRL",
  })
  value?: number

  @IsDateString({ strict: true })
  @IsOptional()
  @ApiProperty({
    required: false,
    example: new Date(),
    description: "Expense date",
  })
  date?: Date
}

export default UpdateExpenseDTO
