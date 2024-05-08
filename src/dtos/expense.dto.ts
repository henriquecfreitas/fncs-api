import {
  IsDate,
  IsPositive,
  IsString,
  IsUUID,
  Length,
} from 'class-validator'

class ExpenseDTO {
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
