import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateEmployeeDto } from './dto/create-employee.dto.js'
import { UpdateEmployeeDto } from './dto/update-employee.dto.js'
import { Employee, EmployeeRole } from './employee.entity.js'

@Injectable()
export class EmployeesService {
  constructor(@InjectRepository(Employee) private readonly employees: Repository<Employee>) {}

  async findAll() {
    return this.employees.find({ order: { createdAt: 'DESC' } })
  }

  async findOne(id: string) {
    const employee = await this.employees.findOne({ where: { id } })
    if (!employee) throw new NotFoundException('Karyawan tidak ditemukan.')
    return employee
  }

  async findByEmailWithPassword(email: string) {
    return this.employees
      .createQueryBuilder('employee')
      .addSelect('employee.passwordHash')
      .where('LOWER(employee.email) = LOWER(:email)', { email })
      .getOne()
  }

  async create(dto: CreateEmployeeDto) {
    await this.ensureUnique(dto.email, dto.nik)
    const employee = this.employees.create({
      ...dto,
      email: dto.email.toLowerCase(),
      role: dto.role ?? EmployeeRole.EMPLOYEE,
      passwordHash: await bcrypt.hash(dto.password, 12),
    })
    delete (employee as Partial<Employee> & { password?: string }).password
    return this.employees.save(employee)
  }

  async update(id: string, dto: UpdateEmployeeDto) {
    const employee = await this.findOne(id)
    if (dto.email && dto.email.toLowerCase() !== employee.email) await this.ensureUnique(dto.email, undefined, id)
    if (dto.nik && dto.nik !== employee.nik) await this.ensureUnique(undefined, dto.nik, id)

    Object.assign(employee, dto)
    if (dto.email) employee.email = dto.email.toLowerCase()
    if (dto.password) employee.passwordHash = await bcrypt.hash(dto.password, 12)
    delete (employee as Partial<Employee> & { password?: string }).password
    return this.employees.save(employee)
  }

  async remove(id: string) {
    const employee = await this.findOne(id)
    await this.employees.remove(employee)
    return { message: 'Karyawan berhasil dihapus.' }
  }

  private async ensureUnique(email?: string, nik?: string, excludedId?: string) {
    const query = this.employees.createQueryBuilder('employee')
    if (email) query.where('LOWER(employee.email) = LOWER(:email)', { email })
    if (nik) query.orWhere('employee.nik = :nik', { nik })
    if (excludedId) query.andWhere('employee.id != :excludedId', { excludedId })
    const existing = await query.getOne()
    if (existing) throw new ConflictException('Email atau NIK sudah digunakan.')
  }
}
