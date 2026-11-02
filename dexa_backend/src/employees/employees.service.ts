import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
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

  async updatePassword(id: string, password: string) {
    const employee = await this.findOneWithPassword(id)
    employee.passwordHash = await bcrypt.hash(password, 12)
    return this.employees.save(employee)
  }

  async create(dto: CreateEmployeeDto) {
    this.ensureMatchingPasswords(dto.password, dto.passwordConfirmation)
    await this.ensureUnique(dto.email)
    const employee = this.employees.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      employeeCode: await this.nextEmployeeCode(),
      role: dto.role ?? EmployeeRole.EMPLOYEE,
      position: dto.position,
      department: dto.department,
      phone: dto.phone ?? null,
      passwordHash: await bcrypt.hash(dto.password, 12),
    })
    return this.employees.save(employee)
  }

  async update(id: string, dto: UpdateEmployeeDto) {
    const employee = await this.findOne(id)
    if (dto.email && dto.email.toLowerCase() !== employee.email) await this.ensureUnique(dto.email, id)
    if (dto.password) this.ensureMatchingPasswords(dto.password, dto.passwordConfirmation)

    Object.assign(employee, dto)
    if (dto.email) employee.email = dto.email.toLowerCase()
    if (dto.password) employee.passwordHash = await bcrypt.hash(dto.password, 12)
    delete (employee as Partial<Employee> & { password?: string; passwordConfirmation?: string }).password
    delete (employee as Partial<Employee> & { passwordConfirmation?: string }).passwordConfirmation
    return this.employees.save(employee)
  }

  async remove(id: string) {
    const employee = await this.findOne(id)
    await this.employees.remove(employee)
    return { message: 'Karyawan berhasil dihapus.' }
  }

  private async ensureUnique(email?: string, excludedId?: string) {
    const query = this.employees.createQueryBuilder('employee')
    if (email) query.where('LOWER(employee.email) = LOWER(:email)', { email })
    if (excludedId) query.andWhere('employee.id != :excludedId', { excludedId })
    const existing = await query.getOne()
    if (existing) throw new ConflictException('Email sudah digunakan.')
  }

  async findOneWithPassword(id: string) {
    const employee = await this.employees
      .createQueryBuilder('employee')
      .addSelect('employee.passwordHash')
      .where('employee.id = :id', { id })
      .getOne()
    if (!employee) throw new NotFoundException('Karyawan tidak ditemukan.')
    return employee
  }

  private async nextEmployeeCode() {
    const employees = await this.employees.find({ select: ['employeeCode'] })
    const highest = employees.reduce((max, employee) => {
      const number = Number(employee.employeeCode.replace(/^DEXA/i, ''))
      return Number.isFinite(number) ? Math.max(max, number) : max
    }, 0)
    return `DEXA${String(highest + 1).padStart(2, '0')}`
  }

  private ensureMatchingPasswords(password: string, confirmation?: string) {
    if (password !== confirmation) throw new BadRequestException('Konfirmasi password gagal.')
  }
}
