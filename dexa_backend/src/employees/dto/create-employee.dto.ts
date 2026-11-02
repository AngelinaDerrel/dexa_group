import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { EmployeeRole } from '../employee.entity.js'

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsEmail()
  email!: string

  @IsString()
  @MinLength(8)
  password!: string

  @IsString()
  @MinLength(8)
  passwordConfirmation!: string

  @IsString()
  @IsNotEmpty()
  position!: string

  @IsString()
  @IsNotEmpty()
  department!: string

  @IsString()
  @IsNotEmpty()
  phone!: string

  @IsEnum(EmployeeRole)
  role!: EmployeeRole
}
