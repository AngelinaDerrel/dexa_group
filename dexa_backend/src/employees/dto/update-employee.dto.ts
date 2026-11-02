import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'
import { EmployeeRole } from '../employee.entity.js'

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string

  @IsOptional()
  @IsString()
  @MinLength(8)
  passwordConfirmation?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  position?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  department?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsEnum(EmployeeRole)
  role?: EmployeeRole

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
