import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { Employee } from '../employees/employee.entity.js'
import { EmployeesService } from '../employees/employees.service.js'
import { ChangePasswordDto } from './dto/change-password.dto.js'

@Injectable()
export class AuthService {
  constructor(
    private readonly employees: EmployeesService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(email: string, password: string) {
    const employee = await this.employees.findByEmailWithPassword(email)
    if (!employee || !employee.isActive || !(await bcrypt.compare(password, employee.passwordHash))) {
      throw new UnauthorizedException('Email atau password salah.')
    }

    const token = await this.jwt.signAsync({ sub: employee.id, role: employee.role, name: employee.name })
    return { token, user: this.toPublicUser(employee), expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '1d') }
  }

  getProfile(employee: Employee) {
    return this.toPublicUser(employee)
  }

  async changePassword(employee: Employee, dto: ChangePasswordDto) {
    if (dto.newPassword !== dto.passwordConfirmation) {
      throw new BadRequestException('Konfirmasi password gagal.')
    }
    const employeeWithPassword = await this.employees.findOneWithPassword(employee.id)
    if (!(await bcrypt.compare(dto.currentPassword, employeeWithPassword.passwordHash))) {
      throw new UnauthorizedException('Password saat ini salah.')
    }
    await this.employees.updatePassword(employee.id, dto.newPassword)
    return { message: 'Password berhasil diubah.' }
  }

  private toPublicUser(employee: Employee) {
    const { passwordHash: _passwordHash, ...user } = employee
    return user
  }
}
