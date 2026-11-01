import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { Roles } from '../auth/roles.decorator.js'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { RolesGuard } from '../auth/roles.guard.js'
import { EmployeeRole } from './employee.entity.js'
import { CreateEmployeeDto } from './dto/create-employee.dto.js'
import { UpdateEmployeeDto } from './dto/update-employee.dto.js'
import { EmployeesService } from './employees.service.js'

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(EmployeeRole.HRD)
export class EmployeesController {
  constructor(private readonly employees: EmployeesService) {}

  @Get()
  findAll() { return this.employees.findAll() }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.employees.findOne(id) }

  @Post()
  create(@Body() dto: CreateEmployeeDto) { return this.employees.create(dto) }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) { return this.employees.update(id, dto) }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.employees.remove(id) }
}
