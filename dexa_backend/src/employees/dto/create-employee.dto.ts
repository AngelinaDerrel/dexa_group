import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'
import { EmployeeRole } from '../employee.entity.js'

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsString()
  @IsNotEmpty()
  nik!: string

  @IsEmail()
  email!: string

  @IsString()
  @MinLength(8)
  password!: string

  @IsString()
  @IsNotEmpty()
  position!: string

  @IsString()
  @IsNotEmpty()
  department!: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsEnum(EmployeeRole)
  role?: EmployeeRole
}
