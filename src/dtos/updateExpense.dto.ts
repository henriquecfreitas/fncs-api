import { Optional } from "@nestjs/common"
import { IsDateString, IsPositive, Length } from "class-validator"

class UpdateExpenseDTO {
  @Length(1, 191)
  @Optional()
  description?: string

  @IsPositive()
  @Optional()
  value?: number

  @IsDateString()
  @Optional()
  date?: Date
}

export default UpdateExpenseDTO
