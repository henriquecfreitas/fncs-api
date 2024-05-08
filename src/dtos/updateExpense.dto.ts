import { IsDateString, IsOptional, IsPositive, Length } from "class-validator"

class UpdateExpenseDTO {
  @Length(1, 191)
  @IsOptional()
  description?: string

  @IsPositive()
  @IsOptional()
  value?: number

  @IsDateString({ strict: true })
  @IsOptional()
  date?: Date
}

export default UpdateExpenseDTO
