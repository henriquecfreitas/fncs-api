import { IsDateString, IsPositive, Length } from "class-validator"

class NewExpenseDTO {
  @Length(1, 191)
  description: string
  
  @IsPositive()
  value: number
  
  @IsDateString()
  date: Date
}

export default NewExpenseDTO
